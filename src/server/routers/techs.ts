import { techs } from "@/db/schema";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const techsRouter = createTRPCRouter({
  getAll: adminProcedure.query( async ({ctx}) => {
    const { db } = ctx;
    const data = await db.select().from(techs)
    return data;
  })
})