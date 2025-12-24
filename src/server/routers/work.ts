import { createTRPCRouter, publicProcedure } from "../trpc";
import { works, m2m_worksToTechs, techs } from "@/db/schema"; 
import { desc, eq } from "drizzle-orm";

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const rows = await db
      .select({
        work: {
          id: works.id,
          title: works.title,
          description: works.description,
          githubUrl: works.githubUrl,
          lpSiteUrl: works.lpSiteUrl,
          siteUrl: works.siteUrl,
          thumbnail: works.thumbnail,
          miniThumbnail: works.miniThumbnail,
          category: works.category,
          createdAt: works.createdAt,
          updatedAt: works.updatedAt,
        },
        m2m: {
          workId: m2m_worksToTechs.workId,
          techId: m2m_worksToTechs.techId,
          description: m2m_worksToTechs.description,
        },
        tech: {
          id: techs.id,
          name: techs.name,
          description: techs.description,
          iconUrl: techs.iconUrl,
        },
      })
      .from(works)
      .leftJoin(m2m_worksToTechs, eq(works.id, m2m_worksToTechs.workId))
      .leftJoin(techs, eq(m2m_worksToTechs.techId, techs.id))
      .orderBy(desc(works.createdAt));

    const result = rows.reduce((acc, row) => {
      const workId = row.work.id;
      if (!workId) return acc; 

      let currentWork = acc.find((w) => w.id === workId);

      if (!currentWork) {
        currentWork = { ...row.work, worksToTechs: [] };
        acc.push(currentWork);
      }

      if (row.tech && row.tech.id) {
        currentWork.worksToTechs.push({
          workId: row.m2m?.workId,
          techId: row.m2m?.techId,
          description: row.m2m?.description,
          tech: row.tech,
        });
      }

      return acc;
    }, [] as any[]);

    return result;
  }),
});