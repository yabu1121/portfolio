import { techs } from "@/db/schema";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const techsRouter = createTRPCRouter({
  getAll: adminProcedure.query( async ({ctx}) => {
    const { db } = ctx;
    const data = await db.select().from(techs)
    return data;
  }),

  getByID: adminProcedure
  .input(z.object({
    id: z.string().uuid()
  }))
  .query( async ({ctx, input}) => {
    const { db } = ctx;
    const [row] = await db
      .select()
      .from(techs)
      .where(eq(techs.id, input.id))
      .limit(1);
    return row ?? null; 
  })
})