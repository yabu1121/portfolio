import { myTechs, techs } from "@/db/schema";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import z, { number, string } from "zod";

export const skillRouter = createTRPCRouter({
  getAll: publicProcedure.query(async({ctx}) => {
    const { db } = ctx;
    const skillData = await db
    .select({
      id: myTechs.id,
      name: techs.name,
      iconUrl: techs.iconUrl,
      level: myTechs.level,
      description: techs.description,
    })
    .from(techs)
    .innerJoin(myTechs, eq(myTechs.techId, techs.id))
    return skillData;
  }),

  getByID: adminProcedure
  .input(z.object({
    id: string().uuid(),
  }))
  .query(async ({ctx, input}) => {
    const { db } = ctx;
    const { id } = input;
    const [skill] = await db
    .select({
      id: myTechs.id,
      name: techs.name,
      iconUrl: techs.iconUrl,
      level: myTechs.level,
      description: techs.description,
    })
    .from(techs)
    .innerJoin(myTechs, eq(myTechs.techId, techs.id))
    .where(eq(myTechs.id, id))
    .limit(1)
    return skill;
  }),

  create: adminProcedure
  .input(z.object({
    techId: string().uuid(),
    level: number().int().min(1).max(100),
    description: string(),
  }))
  .mutation(async({ctx, input}) => {
    const { db } = ctx;
    const [inserted] = await db
    .insert(myTechs)
    .values(input)
    .returning()
    return inserted
  }),

  delete: adminProcedure
  .input(z.object({
    id: string().uuid()
  }))
  .mutation(async ({ctx, input}) => {
    const { db } = ctx;
    const { id } = input;
    const [deleted] = await db
    .delete(myTechs)
    .where(eq(myTechs.id, id))
    .returning()
    return deleted
  }),

  update: adminProcedure
  .input(z.object({
    id: string().uuid(),
    techId: string().uuid(),
    level: number().int().min(1).max(100),
    description: string(),
  }))
  .mutation(async ({ctx, input}) => {
    const { db } = ctx;
    const { id, ...values } = input;
    const [updated] = await db
    .update(myTechs)
    .set(values)
    .where(eq(myTechs.id, id))
    .returning()
    return updated
  })
})