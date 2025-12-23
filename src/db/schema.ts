import { pgTable, uuid, varchar, timestamp, text, integer, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- 1. Skills (techs) テーブル ---
// 元データの { id, name, level, description } に対応
export const techs = pgTable('techs', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  level: integer('level').default(0), // 30, 35 などの習熟度
  description: text('description'),   // 「基礎、ファイル操作...」などの詳細
  iconUrl: varchar('icon_url', { length: 255 }),
  color: varchar('color', { length: 7 }),
});

// --- 2. Timeline テーブル ---
// 元データの { id, year, month, category, title, detail } に対応
export const timeline = pgTable('timeline', {
  id: uuid('id').defaultRandom().primaryKey(),
  year: varchar('year', { length: 4 }).notNull(),   // "2024"
  month: integer('month').notNull(),                // 4
  category: varchar('category', { length: 50 }).notNull(), // "learn", "intern"
  title: varchar('title', { length: 255 }).notNull(),
  detail: text('detail').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- 3. Projects (works) テーブル ---
// 元データの { id, title, description, github, url, image, category } に対応
export const works = pgTable('works', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  githubUrl: varchar('github_url', { length: 255 }),
  lpSiteUrl: varchar('lp_site_url', { length: 255 }),
  thumbnail: varchar('thumbnail', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // "self", "udemy"
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

// --- 4. 中間テーブル (m2m) ---
// Project と Tech を紐付ける
export const m2m_worksToTechs = pgTable('m2m_works_to_techs', {
  workId: uuid('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
  techId: uuid('tech_id').notNull().references(() => techs.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.workId, t.techId] }),
}));

// --- 5. リレーションの定義 (m2m用) ---
export const worksRelations = relations(works, ({ many }) => ({
  worksToTechs: many(m2m_worksToTechs),
}));

export const techsRelations = relations(techs, ({ many }) => ({
  worksToTechs: many(m2m_worksToTechs),
}));

export const m2m_worksToTechsRelations = relations(m2m_worksToTechs, ({ one }) => ({
  work: one(works, { fields: [m2m_worksToTechs.workId], references: [works.id] }),
  tech: one(techs, { fields: [m2m_worksToTechs.techId], references: [techs.id] }),
}));