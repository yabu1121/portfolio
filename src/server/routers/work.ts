import { createTRPCRouter, publicProcedure } from "../trpc";
import { works, m2m_worksToTechs, techs } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    /**
     * 学習ポイント:
     * - Supabase (Transaction Mode) で `prepare: false` を使用する場合、
     *   SQLの結果セットでカラム名が重複していると（例: works.id と techs.id が共に "id"）、
     *   ドライバが値を上書きしてしまい、正しくデータを復元できません。
     * - これを防ぐため、sql`` を使って明示的に `AS "unique_name"` というエイリアスを
     *   SQL発行時点で付与する必要があります。
     */
    const rows = await db
      .select({
        // Work info (これらはユニークならそのままでも良いが、念のため明示するか、collisionがないものはそのままでOK)
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

        // Tech info (Workと名前が被る id, name等はエイリアス必須)
        techId: sql<string>`${techs.id}`.as('tech_id'),
        techName: sql<string>`${techs.name}`.as('tech_name'),
        techIconUrl: sql<string | null>`${techs.iconUrl}`.as('tech_icon_url'),

        // M2M info (descriptionがWorksと被るためエイリアス必須)
        techDescription: sql<string | null>`${m2m_worksToTechs.description}`.as('tech_description'),
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