import { after } from 'next/server'
import { lt, sql } from 'drizzle-orm'
import { db } from '@/db'
import { requestLog } from '@/db/schema'
import { ipHash } from '@/app/utils/visitor'

/*
 * API の呼び出しを 1 行ずつ残す。
 *
 * **返事を待たせない。** 記録のために応答が遅くなったら本末転倒なので、
 * 書き込みは返事を返したあとに回す。失敗しても黙って捨てる（記録が取れない
 * ことより、API が落ちる方が困る）。
 *
 * **after() に載せる。投げっぱなしでは落ちる。** サーバーレスは応答を返した
 * 時点で関数を止めてよいことになっているので、ただの Promise だと書き込みが
 * 間に合わない（実際に 3 回叩いて 2 行しか残らなかった）。after() に入れた
 * ものは、返事のあとまで動かしてもらえる。
 *
 * **ページの描画は記録しない。** 閲覧のたびに書き込みが増える。
 */

const SITE = 'www'

/** 何日ぶん残すか。これより古い行はときどき掃除する */
const KEEP_DAYS = 14

/*
 * 掃除。**毎回はやらない。** 50 回に 1 回だけ古い行を落とす。
 * cron を増やさずに済むし、消し漏れても次の呼び出しで消える。
 */
const sweep = async () => {
  if (Math.random() > 0.02) return
  await db
    .delete(requestLog)
    .where(lt(requestLog.at, sql`now() - interval '${sql.raw(String(KEEP_DAYS))} days'`))
}

type Entry = {
  route: string
  method: string
  status: number
  ms: number
  headers?: Headers
  /** 後から切り口を足すための自由欄。action=like など */
  note?: string
}

export const logRequest = ({ route, method, status, ms, headers, note }: Entry) => {
  // ip は記録の中で読む。after() の中では request のヘッダに触れない作りもあるため
  const ip = headers ? ipHash(headers) : null

  after(async () => {
    try {
      await db.insert(requestLog).values({
        site: SITE,
        route,
        method,
        status,
        ms: Math.round(ms),
        ip,
        note: note?.slice(0, 120) ?? null,
      })
      await sweep()
    } catch {
      // 記録が取れなくても、API の返事には関係ない
    }
  })
}

/*
 * 経路の処理を包んで、終わったら記録する。
 *
 * **例外も記録する。** 落ちたときこそ残っていてほしいので、投げ直す前に
 * 500 として書く。
 */
export const withLog = (
  route: string,
  handler: (request: Request) => Promise<Response>,
) => {
  return async (request: Request): Promise<Response> => {
    const started = performance.now()
    try {
      const res = await handler(request)
      logRequest({
        route,
        method: request.method,
        status: res.status,
        ms: performance.now() - started,
        headers: request.headers,
        note: new URL(request.url).searchParams.get('kind') ?? undefined,
      })
      return res
    } catch (error) {
      logRequest({
        route,
        method: request.method,
        status: 500,
        ms: performance.now() - started,
        headers: request.headers,
        note: error instanceof Error ? error.message : undefined,
      })
      throw error
    }
  }
}
