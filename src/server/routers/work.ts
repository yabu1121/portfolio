import { createTRPCRouter, publicProcedure } from "../trpc";
import { works, m2m_worksToTechs, techs } from "@/db/schema"; // schemaからimportを追加
import { desc, eq } from "drizzle-orm";

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const rows = await db
      .select({
        work: works,
        m2m: m2m_worksToTechs,
        tech: techs,
      })
      .from(works)
      .leftJoin(m2m_worksToTechs, eq(works.id, m2m_worksToTechs.workId))
      .leftJoin(techs, eq(m2m_worksToTechs.techId, techs.id))
      .orderBy(desc(works.createdAt));

    const result = rows.reduce((acc, row) => {
      const workId = row.work.id;
      
      let currentWork = acc.find(w => w.id === workId);
      
      if (!currentWork) {
        currentWork = { ...row.work, worksToTechs: [] };
        acc.push(currentWork);
      }

      if (row.tech && row.m2m) {
        currentWork.worksToTechs.push({
          ...row.m2m,
          tech: row.tech,
        });
      }
      
      return acc;
    }, [] as any[]);

    return result;
  }),
});