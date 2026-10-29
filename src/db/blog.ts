import { pgSchema, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

/*
 * blog（blog schema）の読み取り用の写し。
 *
 * **ここから書き込まない。** テーブルを作り替えるのは admin リポジトリの
 * drizzle/ 側だけ。portfolio は最近の記事を出すために読むだけ。
 */
export const blogSchema = pgSchema('blog');

export const posts = blogSchema.table('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  excerpt: text('excerpt'),
  coverImage: varchar('cover_image', { length: 255 }),
  published: boolean('published').default(false).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
