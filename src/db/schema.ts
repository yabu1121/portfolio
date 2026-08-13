import { pgTable, uuid, varchar, timestamp, text, integer, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const techs = pgTable('techs', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  iconUrl: varchar('icon_url', { length: 255 }),
  // 'language' | 'framework' | 'library' | 'database' | 'infra'
  // level(理解度)を表示するのは language のみ。src/app/utils/techKind.ts を参照。
  kind: varchar('kind', { length: 20 }).notNull().default('library'),
});

export const myTechs = pgTable('my_techs', {
  id: uuid('id').defaultRandom().primaryKey(),
  techId: uuid('tech_id').notNull().references(() => techs.id, { onDelete: 'cascade' }),
  level: integer('level').default(0).notNull(),
  description: text('description'),
});

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  name: varchar('name').notNull(),
})

// 期間の表現は3パターン。開始・終了とも day は任意なので、
// 「月～月」「日～日」のどちらの粒度でも登録できる。
//   単発   : end_* がすべて null かつ is_ongoing = false → 2024.10 / 2024.10.15
//   期間   : end_year と end_month あり                  → 2024.04 – 2025.03
//   継続中 : is_ongoing = true                           → 2024.04 – 現在
// 表示の組み立ては src/app/utils/timelineDate.ts に集約している。
export const timeline = pgTable('timeline', {
  id: uuid('id').defaultRandom().primaryKey(),
  year: varchar('year', { length: 4 }).notNull(),
  month: integer('month').notNull(),
  day: integer('day'),
  endYear: varchar('end_year', { length: 4 }),
  endMonth: integer('end_month'),
  endDay: integer('end_day'),
  isOngoing: boolean('is_ongoing').default(false).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  detail: text('detail').notNull(),
  // 登壇資料・記事・リポジトリなど、その経歴の裏付けになる外部リンク（任意・複数可）。
  // 1つの経歴に「スライドと記事の両方」を紐付けたいので配列にしている。
  urls: text('urls').array(),
  // 成果物のスクリーンショット（任意・複数可）。Supabase に上げた public URL を入れる。
  // 文章だけでは伝わらない可視化などを、展開したときに見せるため。
  imageUrls: text('image_urls').array(),
  // 動きのある成果物（3Dの回転など）。GIFは容量が大きくアップロードAPIも受け付けないため、
  // mp4 を public/videos に置いてそのパスを入れる。
  videoUrl: varchar('video_url', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const works = pgTable('works', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  githubUrl: varchar('github_url', { length: 255 }),
  lpSiteUrl: varchar('lp_site_url', { length: 255 }),
  siteUrl: varchar('site_url', { length: 255 }),
  thumbnail: varchar('thumbnail', { length: 255 }),
  miniThumbnail: varchar('mini_thumbnail', { length: 255 }),
  category: varchar('category', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

export const contact = pgTable('contact', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  senderUser: varchar('sender_user', { length: 255 }),
  senderPassword: varchar('sender_password', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})


export const m2m_worksToTechs = pgTable('m2m_works_to_techs', {
  workId: uuid('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
  techId: uuid('tech_id').notNull().references(() => techs.id, { onDelete: 'cascade' }),
  description: text('description'),
}, (t) => ({
  pk: primaryKey({ columns: [t.workId, t.techId] }),
}));

export const m2m_worksToTechsRelations = relations(m2m_worksToTechs, ({ one }) => ({
  work: one(works, { fields: [m2m_worksToTechs.workId], references: [works.id] }),
  tech: one(techs, { fields: [m2m_worksToTechs.techId], references: [techs.id] }),
}));

export const worksRelations = relations(works, ({ many }) => ({
  worksToTechs: many(m2m_worksToTechs),
}));

export const techsRelations = relations(techs, ({ many }) => ({
  worksToTechs: many(m2m_worksToTechs),
  myTechs: many(myTechs), 
}));

export const myTechsRelations = relations(myTechs, ({ one }) => ({
  tech: one(techs, {
    fields: [myTechs.techId],
    references: [techs.id],
  }),
}));