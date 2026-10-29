import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { events, myTechs, techs, timeline } from '@/db/schema'
import { deckIsPublic, decks } from '@/db/slides'

/*
 * /about が出すもの。**サーバーで引く。**
 *
 * 以前はブラウザに HTML を返したあと、経歴・イベント・技術をそれぞれ
 * 取りに行っていた。HTML は 0.1 秒で届くのに、イベントが出るまで 3.5 秒
 * かかっていて、その間ずっと骨組みだけが見えていた。
 *
 * tRPC の口（timeline.getAllForPublic など）は admin や他から使うので残す。
 * ここは同じものをサーバーから直接引くだけ。
 */

export const listTimelineForPublic = () =>
  db
    .select({
      year: timeline.year,
      month: timeline.month,
      day: timeline.day,
      endYear: timeline.endYear,
      endMonth: timeline.endMonth,
      endDay: timeline.endDay,
      isOngoing: timeline.isOngoing,
      category: timeline.category,
      title: timeline.title,
      detail: timeline.detail,
      urls: timeline.urls,
      imageUrls: timeline.imageUrls,
      videoUrl: timeline.videoUrl,
      /*
       * 出していいデッキだけ結合する。条件は db/slides.ts に 1 つだけ置いてある。
       * 条件に合わないものは、題名も含めてすべて null で返る。
       */
      deckSlug: sql<string | null>`case when ${decks.slug} is null then null else ${timeline.deckSlug} end`,
      deckTitle: decks.title,
      deckDate: decks.date,
      deckSlideCount: decks.slideCount,
    })
    .from(timeline)
    .leftJoin(decks, and(eq(timeline.deckSlug, decks.slug), deckIsPublic()))
    .orderBy(asc(timeline.year), asc(timeline.month), asc(timeline.day))

export const listEvents = () =>
  db.select().from(events).orderBy(asc(events.year), asc(events.month))

/** 言語だけ理解度を出す。並びは理解度の高い順（画面側で絞っていたのをここに寄せた） */
export const listSkills = () =>
  db
    .select({
      id: myTechs.id,
      name: techs.name,
      iconUrl: techs.iconUrl,
      kind: techs.kind,
      level: myTechs.level,
      description: myTechs.description,
    })
    .from(techs)
    .innerJoin(myTechs, eq(myTechs.techId, techs.id))
    .orderBy(desc(myTechs.level))
