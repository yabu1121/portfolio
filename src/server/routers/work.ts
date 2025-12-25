import { createTRPCRouter, publicProcedure } from "../trpc";
import { works } from "@/db/schema";
import { desc } from "drizzle-orm";

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const worksData = await db.query.works.findMany({
      orderBy: [desc(works.createdAt)],
      with: {
        worksToTechs: {
          with: {
            tech: true, 
          },
        },
      },
    });

    return worksData;
  }),
});