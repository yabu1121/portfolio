import { asc, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { m2m_worksToTechs, myTechs, techs, workMedia, works } from '@/db/schema'

/*
 * 作品の読み出し。
 *
 * **一覧と詳細で引くものを分ける。** これまでは一覧でも「全作品 + 全メディア
 * + 各技術の理解度」を取っていて、使っていないものまで毎回運んでいた
 * （42KB）。一覧に要るのは表紙と題と技術名だけ。
 */

export type ListedWork = Awaited<ReturnType<typeof listWorks>>[number]

export const listWorks = async () => {
  const rows = await db
    .select({
      id: works.id,
      title: works.title,
      description: works.description,
      category: works.category,
      thumbnail: works.thumbnail,
      miniThumbnail: works.miniThumbnail,
      githubUrl: works.githubUrl,
      lpSiteUrl: works.lpSiteUrl,
      siteUrl: works.siteUrl,
      createdAt: works.createdAt,
    })
    .from(works)
    .orderBy(desc(works.createdAt))

  if (rows.length === 0) return []

  /*
   * 技術は 1 回でまとめて引いて、JS で配る。作品ごとに引くと、作品の数だけ
   * 往復する（N+1）。件数は数十なので、まとめて取って配る方が速い。
   */
  const links = await db
    .select({
      workId: m2m_worksToTechs.workId,
      id: techs.id,
      name: techs.name,
      iconUrl: techs.iconUrl,
      kind: techs.kind,
    })
    .from(m2m_worksToTechs)
    .innerJoin(techs, eq(m2m_worksToTechs.techId, techs.id))
    .where(inArray(m2m_worksToTechs.workId, rows.map((row) => row.id)))

  const byWork = new Map<string, typeof links>()
  for (const link of links) {
    const list = byWork.get(link.workId) ?? []
    list.push(link)
    byWork.set(link.workId, list)
  }

  return rows.map((row) => ({ ...row, techs: byWork.get(row.id) ?? [] }))
}

/** 詳細。ここでだけメディアと理解度まで取る */
export const getWork = async (id: string) => {
  const [work] = await db.select().from(works).where(eq(works.id, id)).limit(1)
  if (!work) return undefined

  const [media, linked] = await Promise.all([
    db
      .select()
      .from(workMedia)
      .where(eq(workMedia.workId, id))
      .orderBy(asc(workMedia.sort), asc(workMedia.createdAt)),
    db
      .select({
        id: techs.id,
        name: techs.name,
        iconUrl: techs.iconUrl,
        kind: techs.kind,
        /*
         * **2 つある。混ぜない。**
         *   about       ... その技術そのものの説明（techs 側）
         *   description ... この作品で何に使ったか（中間テーブル側）
         * 詳細ページは左にどんな技術か、右にこの作品での使い道を出す。
         */
        about: techs.description,
        description: m2m_worksToTechs.description,
        level: myTechs.level,
      })
      .from(m2m_worksToTechs)
      .innerJoin(techs, eq(m2m_worksToTechs.techId, techs.id))
      .leftJoin(myTechs, eq(myTechs.techId, techs.id))
      .where(eq(m2m_worksToTechs.workId, id)),
  ])

  return { ...work, media, techs: linked }
}
