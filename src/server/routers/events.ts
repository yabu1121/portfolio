import { events } from "@/db/schema";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

export const eventsRouter = createTRPCRouter({
  create: adminProcedure
    .input(z.object({
      year: z.number().int(),
      month: z.number().int().min(1).max(12),
      name: z.string().min(1),
    }))
    .mutation(async ({ctx, input}) => {
      const { db } = ctx;
      const [row] = await db
        .insert(events)
        .values(input)
        .returning();
      return row;
    }),

  delete: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ctx, input}) => {
      const { db } = ctx;
      const { id } = input;
      const [deleted] = await db
        .delete(events)
        .where(eq(events.id, id))
        .returning()
      return deleted;
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      year: z.number().int(),
      month: z.number().int().min(1).max(12),
      name: z.string().min(1),
    }))
    .mutation(async ({ctx, input}) => {
      const { db } = ctx;
      const { id, ...values} = input;
      const [updated] = await db
        .update(events)
        .set(values)
        .where(eq(events.id, id))
        .returning()
      return updated;
    }),
  
  getAll: publicProcedure.query(async ({ctx}) => {
    const { db } = ctx;
    const data = await db
      .select()
      .from(events)
      .orderBy(asc(events.year),asc(events.month));
    return data;
  }),

  getByID: adminProcedure
  .input(z.object({
    id: z.string().uuid(),
  }))
  .query(async ({ctx, input}) => {
    const { db } = ctx;
    const { id } = input;
    const [row] = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1)
    return row
  })
})