import { myTechs, techs } from "@/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";

export const skillRouter = createTRPCRouter({
  getAll: publicProcedure.query(async({ctx}) => {
    const {db} = ctx;
    const skillData = await db
    .select({
      id: techs.id,
      name: techs.name,
      iconUrl: techs.iconUrl,
      level: myTechs.level,
      description: techs.description,
    })
    .from(techs)
    .innerJoin(myTechs, eq(myTechs.techId, techs.id))
    return skillData;
  })
})