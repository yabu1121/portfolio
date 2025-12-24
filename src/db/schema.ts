import { pgTable, uuid, varchar, timestamp, text, integer, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const techs = pgTable('techs', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  iconUrl: varchar('icon_url', { length: 255 }),
});

export const myTechs = pgTable('my_techs', {
  id: uuid('id').defaultRandom().primaryKey(),
  techId: uuid('tech_id').notNull().references(() => techs.id, { onDelete: 'cascade' }),
  level: integer('level').default(0).notNull(),
  description: text('description'),
});

export const timeline = pgTable('timeline', {
  id: uuid('id').defaultRandom().primaryKey(),
  year: varchar('year', { length: 4 }).notNull(),
  month: integer('month').notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  detail: text('detail').notNull(),
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
}));