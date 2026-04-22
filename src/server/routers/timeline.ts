import { timeline } from "@/db/schema";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { number, string, z } from "zod";
import { asc, eq } from "drizzle-orm";

export const timelineRouter = createTRPCRouter({
  getAllForPublic: publicProcedure.query(async({ctx}) => {
    const { db } = ctx;
    const rows = await db 
      .select({
        year: timeline.year,
        month: timeline.month,
        category: timeline.category,
        title: timeline.title,
        detail: timeline.detail,
      })
      .from(timeline)
      .orderBy(asc(timeline.year), asc(timeline.month))
    return rows
  }),

  getAll: adminProcedure.query(async({ctx}) => {
    const { db } = ctx;
    const rows = await db
      .select()
      .from(timeline)
      .orderBy(asc(timeline.year), asc(timeline.month))
    return rows;
  }),

  getByID: adminProcedure
  .input(z.object({
    id: string().uuid(),
  }))
  .query(async({ctx, input}) => {
    const { db } = ctx;
    const { id } = input;
    const [row] = await db
      .select()
      .from(timeline)
      .where(eq(timeline.id, id))
      .limit(1)
    return row
  }),

  create: adminProcedure
    .input(z.object({
      year: string(),
      month: number().int().min(1).max(12),
      category: string(),
      title: string(),
      detail: string(),
    }))
    .mutation(async ({ctx, input}) => {
      const { db } = ctx;
      const [inserted] = await db
        .insert(timeline)
        .values(input)
        .returning()
      return inserted
    }),

  delete: adminProcedure
    .input(z.object({
      id: string().uuid(),
    }))
    .mutation(async ({ctx, input}) => {
      const { db } = ctx;
      const { id } = input;
      const [deleted] = await db
        .delete(timeline)
        .where(eq(timeline.id, id))
        .returning()
      return deleted    
    }),

  update: adminProcedure
    .input(z.object({
      id: string().uuid(),
      year: string(),
      month: number().int().min(1).max(12),
      category: string(),
      title: string(),
      detail: string(),
    }))
    .mutation(async ({ctx, input}) => {
      const { db } = ctx;
      const { id, ...values } = input;
      const [updated] = await db
        .update(timeline)
        .set(values)
        .where(eq(timeline.id, id))
        .returning()
      return updated;
    })

})