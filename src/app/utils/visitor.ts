import { createHash, createHmac, randomUUID } from 'node:crypto'
import type { cookies } from 'next/headers'

/*
 * 読んだ人の見分け方。**3 サイトで 1 つの cookie を使う。**
 *
 * www / blog / slides は別のオリジンだが、登録ドメインは同じ（y4bu.net）
 * なので、domain を親に付ければ 3 つとも同じ cookie を送る。同意も 1 回で済む。
 * 送信が通るのも同じ理由（SameSite=Lax はオリジンではなく登録ドメインを見る）。
 *
 * cookie の中身そのものは DB に入れず、鍵付きのハッシュにして入れる。
 * 表が漏れたときに、その値をそのまま cookie に入れれば他人になりすませる
 * ——という経路を作らないため。こちらで要るのは「同じ端末か」だけ。
 */

export const VISITOR_COOKIE = 'y4bu_reactions'

/*
 * 同意の記録。**これは同意が要らない cookie。**
 * 「同意しない」を覚えておくためのものなので、これ自体に同意を求めると
 * 毎回聞き直すことになる。
 *
 * **httpOnly にしない。** ページをキャッシュしたまま「バナーを出すか」を
 * 決めたいので、画面側から読めるようにする。
 */
export const CONSENT_COOKIE = 'y4bu_consent'

/*
 * cookie を配るドメイン。手元（localhost）では付けない。
 * 付けると localhost には合わず、cookie がまったく置かれなくなる。
 */
const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN

/** cookie の寿命。半年 */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180

type Jar = Awaited<ReturnType<typeof cookies>>

export const hasConsent = (jar: Jar) => jar.get(CONSENT_COOKIE)?.value === 'yes'

const keyOf = (salt: string, id: string) =>
  createHmac('sha256', salt).update(id).digest('hex').slice(0, 64)

const saltOf = () => process.env.VISITOR_SALT ?? process.env.REVALIDATE_SECRET

/*
 * 端末を表す鍵。**同意が無ければ配らないし、数えもしない。**
 *
 * httpOnly。画面側から読む用事がない（押したかどうかはサーバに聞く）。
 * 読めるようにすると、他のスクリプトから持ち出せる経路を増やすだけ。
 */
export const visitorKey = (jar: Jar): string | null => {
  const salt = saltOf()
  if (!salt || !hasConsent(jar)) return null

  const found = jar.get(VISITOR_COOKIE)?.value
  const id = found && /^[0-9a-f-]{16,64}$/.test(found) ? found : randomUUID()

  if (id !== found) {
    jar.set(VISITOR_COOKIE, id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
      maxAge: COOKIE_MAX_AGE,
    })
  }

  return keyOf(salt, id)
}

/*
 * もう配られている鍵だけを返す。**配りはしない。**
 * 「押したかどうか」を聞かれたときに使う。聞かれただけで cookie を置くと、
 * 同意していない人にも置いてしまう。
 */
export const peekVisitorKey = (jar: Jar): string | null => {
  const salt = saltOf()
  const found = jar.get(VISITOR_COOKIE)?.value
  if (!salt || !hasConsent(jar) || !found) return null

  return keyOf(salt, found)
}

/*
 * IPv6 を前半 48 ビットに丸める。失敗したら undefined（呼ぶ側がそのまま使う）。
 *
 * **文字で切ってはいけない。** 2001:db8::1 を ':' で割ると ['2001','db8','','1']
 * になり、先頭を取ると住所まるごとが残る。いったん 8 組に開いてから切る。
 */
const prefix48 = (address: string): string | undefined => {
  const bare = address.split('%')[0] // %eth0 のような zone は住所ではない
  const parts = bare.split('::')
  if (parts.length > 2) return undefined // '::' は 1 回だけ

  const toGroups = (part: string): string[] | undefined => {
    if (part === '') return []
    const out: string[] = []
    for (const piece of part.split(':')) {
      // 末尾に v4 が埋まっている形（::ffff:1.2.3.4 など）。2 組ぶんになる
      if (piece.includes('.')) {
        const quad = piece.split('.').map(Number)
        if (quad.length !== 4 || quad.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return undefined
        out.push((((quad[0] << 8) | quad[1]) >>> 0).toString(16), (((quad[2] << 8) | quad[3]) >>> 0).toString(16))
        continue
      }
      if (!/^[0-9a-fA-F]{1,4}$/.test(piece)) return undefined
      out.push(piece)
    }
    return out
  }

  const left = toGroups(parts[0])
  const right = toGroups(parts[1] ?? '')
  if (!left || !right) return undefined

  const groups = parts.length === 2
    ? [...left, ...Array(8 - left.length - right.length).fill('0'), ...right]
    : left

  if (groups.length !== 8) return undefined

  return groups.slice(0, 3).map((g) => g.toLowerCase().padStart(4, '0')).join(':')
}

/*
 * IP の取り出し。**クライアントが書ける値は使わない。**
 *
 * x-forwarded-for は誰でも送れる。先頭を信じると、ヘッダを変えるだけで
 * 毎回「別人」になり、上限がまったく効かなくなる。Vercel が自分で載せる
 * x-vercel-forwarded-for / x-real-ip は、クライアントが同じ名前で送っても
 * 上書きされる。そちらだけを見る。
 *
 * どちらも無いとき（手元の dev など）は 'unknown' に落とす。全員が同じ人
 * として数えられる方向なので、増える側には転ばない。
 */
export const clientIp = (headers: Headers): string => {
  const trusted = headers.get('x-vercel-forwarded-for') ?? headers.get('x-real-ip')
  const ip = trusted?.split(',')[0].trim()
  if (!ip) return 'unknown'

  // ::ffff:1.2.3.4 は v4 なので、v4 として扱う
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip)
  if (mapped) return mapped[1]

  /*
   * 前半 48 ビットまで丸める。これは身元の判定ではなく、水増しの歯止めを
   * 数える単位。契約ごとに 56 や 48 ビットぶんがまるごと渡るので、64 で
   * 数えると、その中で振り直すだけで上限を回避できる。
   */
  if (ip.includes(':')) return prefix48(ip) ?? ip

  return ip
}

/** IP のハッシュ。上限を数えるためだけに持つ。塩が無ければ歯止めを諦める */
export const ipHash = (headers: Headers): string | null => {
  const salt = saltOf()
  if (!salt) return null

  return createHash('sha256').update(`${salt}:${clientIp(headers)}`).digest('hex').slice(0, 64)
}
