import { cookies } from 'next/headers'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { siteLikes, siteViews, works } from '@/db/schema'
import { posts } from '@/db/blog'
import { deckIsPublic, decks } from '@/db/slides'
import { ipHash, peekVisitorKey, visitorKey } from '@/app/utils/visitor'
import { withLog } from '@/lib/request-log'

/*
 * 3 サイト共通の反応の窓口。
 *
 * **ここ 1 本に集める。** slides は静的な HTML でサーバを持たないし、
 * 同じ処理を 3 つに写すと、直すたびに 3 回直すことになる。cookie は
 * 親ドメインに置いてあるので、どのサイトから叩いても同じ端末として届く。
 *
 * **ページの描画からは切り離す。** 記事も作品も作り置きして配っているので、
 * 描画の中で数を増やすと作り置きが効かなくなる。読み込んだあとに
 * ブラウザからここを叩く。
 *
 * 数は返さない。公開側には出さない決まりで、数えた結果は admin でだけ見る。
 */

type Action = 'like' | 'unlike' | 'view'

/*
 * 数えてよい対象。知らない kind は受けない（好きな行を作られないように）。
 *   post / work / deck ... それぞれの中身
 *   page ................ ページそのもの。target はパス。/about のような
 *                         中身を持たない画面の閲覧を数えるのに使う
 */
const KINDS = ['post', 'work', 'deck', 'page'] as const
type Kind = (typeof KINDS)[number]

/*
 * 1 つの IP から入れられる数の上限。
 * cookie は消せるので、消して押し直されると際限なく増える。ここで頭を
 * 抑える。同じ回線の人数より十分大きくとる。
 */
const MAX_LIKES_PER_IP = 10
const MAX_VIEWS_PER_IP_PER_DAY = 20

/*
 * 対象をまたいだ 1 日の総量。
 *
 * 上の 2 つは「ある記事について」の上限なので、対象を変えながら叩けば
 * いくらでも行を作れる。1 つの回線が 1 日に読める量には限りがあるので、
 * そこに頭を付ける。**普通に読んでいて当たる数ではない**（1 日に 60 ページ、
 * 30 回「よかった」を押すのは、読む人の動きではない）。
 */
const MAX_VIEWS_PER_IP_PER_DAY_TOTAL = 60
const MAX_LIKES_PER_IP_PER_DAY_TOTAL = 30

/*
 * 叩いてよいサイト。**ここに無いオリジンには返さない。**
 * 返す相手を絞らないと、よそのページから読者の cookie 付きで叩けてしまう。
 */
const ALLOWED = new Set(
  [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_BLOG_URL,
    process.env.NEXT_PUBLIC_SLIDES_URL,
    'https://www.y4bu.net',
    'https://blog.y4bu.net',
    'https://slides.y4bu.net',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ].filter((url): url is string => Boolean(url)),
)

const cors = (origin: string | null): Record<string, string> => {
  if (!origin || !ALLOWED.has(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    // cookie を付けて呼ぶので、これが無いとブラウザが返事を捨てる
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    Vary: 'Origin',
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: cors(request.headers.get('origin')) })
}

const parse = (url: URL) => {
  const kind = url.searchParams.get('kind')
  const target = url.searchParams.get('target')
  if (!kind || !target) return undefined
  if (!KINDS.includes(kind as Kind)) return undefined
  if (target.length > 160) return undefined

  /*
   * page は「どのサイトの、どのパスか」で持つ（www:/about のように）。
   * **サイト名を付けないと混ざる。** www も slides も入口は / なので、
   * 付けないと 1 つの行に合算されてしまう。表に無いものなので、
   * 存在は確かめられず、形と 1 日の総量で抑える。
   */
  if (kind === 'page' && !/^(www|blog|slides):\/[\w\-/.%]*$/.test(target)) return undefined

  return { kind: kind as Kind, target }
}

/*
 * その対象が本当にあるか。
 *
 * **無いものは数えない。** 形だけ見て受けていたので、適当な文字列を送られる
 * たびに新しい行ができ、IP ごとの上限も「対象ごと」なので頭打ちにならなかった。
 * 表を好きなだけ太らせられる状態だった。
 *
 * page だけは相手の表が無いので、形（上の正規表現）と 1 日の総量で抑える。
 */
const targetExists = async (kind: Kind, target: string) => {
  if (kind === 'page') return true

  if (kind === 'post') {
    const [row] = await db
      .select({ one: sql<number>`1` })
      .from(posts)
      .where(and(eq(posts.slug, target), eq(posts.published, true)))
      .limit(1)
    return Boolean(row)
  }

  if (kind === 'deck') {
    const [row] = await db
      .select({ one: sql<number>`1` })
      .from(decks)
      // 条件は経歴の API と同じものを使う（片方だけ緩いと、出していない
      // デッキの存在を確かめられてしまう）
      .where(and(eq(decks.slug, target), deckIsPublic()))
      .limit(1)
    return Boolean(row)
  }

  // work は id（uuid）。形が違うものは問い合わせるまでもない
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target)) return false

  const [row] = await db
    .select({ one: sql<number>`1` })
    .from(works)
    .where(eq(works.id, target))
    .limit(1)
  return Boolean(row)
}

const handlePost = async (request: Request): Promise<Response> => {
  const headers = cors(request.headers.get('origin'))
  const where = parse(new URL(request.url))
  if (!where) return new Response('Bad Request', { status: 400, headers })

  const body = (await request.json().catch(() => null)) as { action?: Action } | null
  const action = body?.action
  if (action !== 'like' && action !== 'unlike' && action !== 'view') {
    return new Response('Bad Request', { status: 400, headers })
  }

  /*
   * **同意が無ければ何もしない。** cookie を置かないのはもちろん、数えもしない
   * （IP だけで数えると、同意しなかった人を別の鍵で数えていることになる）。
   */
  // 無いものは数えない（表を太らせられないように）
  if (!(await targetExists(where.kind, where.target))) {
    return new Response('Not Found', { status: 404, headers })
  }

  const visitor = visitorKey(await cookies())
  if (!visitor) return Response.json({ counted: false, liked: false }, { headers })

  const ip = ipHash(request.headers)
  const { kind, target } = where

  if (action === 'unlike') {
    await db
      .delete(siteLikes)
      .where(and(eq(siteLikes.kind, kind), eq(siteLikes.target, target), eq(siteLikes.visitor, visitor)))
    return Response.json({ liked: false }, { headers })
  }

  /*
   * 数えるのと上限の判定は**ひとつの取引の中で**やる。
   *
   * 「数えてから入れる」と書くと、同時に 10 本来たときに全部が「まだ 9 件」を
   * 見て、全部が入る。先に錠を取ってから数えれば順番に並ぶので越えない。
   * 錠は取引が終われば自動で外れる。
   *
   * 上限に当たっても**断りは画面に出さない。** 出したところで読む人にできる
   * ことは無いし、どこで止まるかを教えると避け方を教えることになる。
   */
  const today = sql`(now() at time zone 'Asia/Tokyo')::date`

  await db.transaction(async (tx) => {
    if (ip) {
      /*
       * 錠は 2 本。**IP だけのものを先に取る。**
       *
       * 対象ごとの錠しか取らないと、対象を変えて同時に叩かれたときに
       * 「1 日の総量」を全員が同じ値で読んでしまい、上限を越えられる。
       * 取る順番は必ず IP → 対象にする（逆から取る経路があると、
       * 互いの錠を待ち合って止まる）。
       */
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${'total:' + ip}, 0))`)
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${kind + target + ip}, 0))`)

      const [row] =
        action === 'like'
          ? await tx
              .select({ n: sql<number>`count(*)::int` })
              .from(siteLikes)
              .where(and(eq(siteLikes.kind, kind), eq(siteLikes.target, target), eq(siteLikes.ip, ip)))
          : await tx
              .select({ n: sql<number>`count(*)::int` })
              .from(siteViews)
              .where(
                and(
                  eq(siteViews.kind, kind),
                  eq(siteViews.target, target),
                  eq(siteViews.ip, ip),
                  eq(siteViews.day, today),
                ),
              )

      const limit = action === 'like' ? MAX_LIKES_PER_IP : MAX_VIEWS_PER_IP_PER_DAY
      if ((row?.n ?? 0) >= limit) return

      // 対象をまたいだ 1 日の総量。対象を変えながら叩かれても頭打ちになる
      const [all] =
        action === 'like'
          ? await tx
              .select({ n: sql<number>`count(*)::int` })
              .from(siteLikes)
              .where(and(eq(siteLikes.ip, ip), sql`${siteLikes.createdAt} > now() - interval '1 day'`))
          : await tx
              .select({ n: sql<number>`count(*)::int` })
              .from(siteViews)
              .where(and(eq(siteViews.ip, ip), eq(siteViews.day, today)))

      const total = action === 'like' ? MAX_LIKES_PER_IP_PER_DAY_TOTAL : MAX_VIEWS_PER_IP_PER_DAY_TOTAL
      if ((all?.n ?? 0) >= total) return
    }

    if (action === 'view') {
      // 同じ端末の同じ日は 1 行だけ。2 回目以降は主キーで衝突して何も起きない
      await tx
        .insert(siteViews)
        .values({ kind, target, visitor, ip, day: today })
        .onConflictDoNothing()
      return
    }

    await tx.insert(siteLikes).values({ kind, target, visitor, ip }).onConflictDoNothing()
  })

  return Response.json(action === 'like' ? { liked: true } : { counted: true }, { headers })
}

/** いま自分が押しているか。cookie を消していれば「押していない」に戻る */
const handleGet = async (request: Request): Promise<Response> => {
  const headers = cors(request.headers.get('origin'))
  const where = parse(new URL(request.url))
  if (!where) return new Response('Bad Request', { status: 400, headers })

  // ここでは配らない。配るのは数えるとき（POST）だけでいい
  const visitor = peekVisitorKey(await cookies())
  if (!visitor) return Response.json({ liked: false }, { headers })

  const [row] = await db
    .select({ one: sql<number>`1` })
    .from(siteLikes)
    .where(
      and(
        eq(siteLikes.kind, where.kind),
        eq(siteLikes.target, where.target),
        eq(siteLikes.visitor, visitor),
      ),
    )
    .limit(1)

  return Response.json({ liked: Boolean(row) }, { headers })
}

/* 記録は入口で取る。経路は型のまま（実 URL だと行が散って数えられない） */
export const POST = withLog('/api/reactions', handlePost)
export const GET = withLog('/api/reactions', handleGet)
