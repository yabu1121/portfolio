import { createTRPCRouter, publicProcedure } from "../trpc";
import { works, m2m_worksToTechs, techs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    /**
     * 学習ポイント:
     * - Supabase (Transaction Pooler - Port 6543) 環境では、
     *   Relational Query API (db.query) が返す複雑な結果セットを正しくパースできない問題が頻発します。
     * - そのため、db.select() を使用して必要なカラムをフラットに取得し、
     *   アプリケーションコード(reduce)で構造化する手法が最も確実で安全です。
     */
    const rows = await db
      .select({
        // Work info
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
        // Tech info (joined)
        techId: techs.id,
        techName: techs.name,
        techIconUrl: techs.iconUrl,
        // M2M info
        techDescription: m2m_worksToTechs.description,
      })
      .from(works)
      .leftJoin(m2m_worksToTechs, eq(works.id, m2m_worksToTechs.workId))
      .leftJoin(techs, eq(m2m_worksToTechs.techId, techs.id))
      .orderBy(desc(works.createdAt));

    // フラットな結果を構造化データに変換
    type WorkWithTechs = typeof works.$inferSelect & {
      worksToTechs: Array<{
        description: string | null;
        tech: typeof techs.$inferSelect;
      }>;
    };

    const result = rows.reduce<WorkWithTechs[]>((acc, row) => {
      let work = acc.find((w) => w.id === row.id);

      if (!work) {
        work = {
          id: row.id,
          title: row.title,
          description: row.description,
          githubUrl: row.githubUrl,
          lpSiteUrl: row.lpSiteUrl,
          siteUrl: row.siteUrl,
          thumbnail: row.thumbnail,
          miniThumbnail: row.miniThumbnail,
          category: row.category,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          worksToTechs: [],
        };
        acc.push(work);
      }

      if (row.techId && row.techName) {
        work.worksToTechs.push({
          description: row.techDescription,
          tech: {
            id: row.techId,
            name: row.techName,
            iconUrl: row.techIconUrl,
            description: null,
          },
        });
      }

      return acc;
    }, []);

    return result;
  }),
});