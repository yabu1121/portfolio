import { createTRPCRouter, publicProcedure } from "../trpc";
import { works } from "@/db/schema"; 

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const result = await db.query.works.findMany({
      orderBy: (works, { desc }) => [desc(works.createdAt)],
      with: {
        worksToTechs: {
          with: {
            tech: true, 
          },
        },
      },
    });

    return result;
  }),
});