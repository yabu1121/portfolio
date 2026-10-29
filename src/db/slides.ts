import { and, eq, isNull, lte, or, sql } from 'drizzle-orm';
import { pgSchema, varchar, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

/*
 * slides（slides schema）の読み取り用の写し。
 *
 * **ここから書き込まない。** 行を作るのは slides のビルド、published を
 * 変えるのは admin。portfolio は公開中のデッキを並べるために読むだけ。
 */
export const slidesSchema = pgSchema('slides');

export const decks = slidesSchema.table('decks', {
  slug: varchar('slug', { length: 120 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  date: varchar('date', { length: 10 }),
  event: varchar('event', { length: 255 }),
  published: boolean('published').default(true).notNull(),
  publishAt: timestamp('publish_at', { withTimezone: true }),
  frontmatterDraft: boolean('frontmatter_draft').default(false).notNull(),
  missingAt: timestamp('missing_at', { withTimezone: true }),
  slideCount: integer('slide_count'),
  previewToken: varchar('preview_token', { length: 64 }),
  syncedAt: timestamp('synced_at', { withTimezone: true }).defaultNow().notNull(),
});

/*
 * 公開していいデッキの条件。**1 か所に置く。**
 *
 * 経歴の API と反応の窓口で別々に書いていて、片方（反応）だけ条件が緩く、
 * 予約待ちや .md が消えたデッキでも「ある」と答えてしまっていた。答えが
 * 食い違うと、出していないはずのデッキの存在を確かめられる。
 */
export const deckIsPublic = () =>
  and(
    eq(decks.published, true),
    eq(decks.frontmatterDraft, false),
    isNull(decks.missingAt),
    or(isNull(decks.publishAt), lte(decks.publishAt, sql`now()`)),
  );
