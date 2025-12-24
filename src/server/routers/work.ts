import { createTRPCRouter, publicProcedure } from "../trpc";
import { works, m2m_worksToTechs, techs } from "@/db/schema"; 
import { desc, eq } from "drizzle-orm";

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    // 1. 各テーブルの結果を「オブジェクト」として分離して受け取る
    // これにより、SQL側でエイリアスが自動付与され、カラム名の重複エラーが消えます。
    const rows = await db
      .select({
        work: works,
        worksToTechs: m2m_worksToTechs,
        tech: techs,
      })
      .from(works)
      .leftJoin(m2m_worksToTechs, eq(works.id, m2m_worksToTechs.workId))
      .leftJoin(techs, eq(m2m_worksToTechs.techId, techs.id))
      .orderBy(desc(works.createdAt));

    // 2. JS側でネスト構造に整形（Reduce）
    // DB側でJSON化（db.query）するのではなく、ここで組み立てるのが最も安全です。
    const result = rows.reduce((acc, row) => {
      const work = row.work;
      const m2m = row.worksToTechs;
      const tech = row.tech;

      // すでにこの制作物(Work)が配列にあるか確認
      let currentWork = acc.find((w) => w.id === work.id);

      if (!currentWork) {
        // 初めて登場する Work なら、初期構造を作成
        currentWork = { ...work, worksToTechs: [] };
        acc.push(currentWork);
      }

      // 中間テーブル(m2m)と技術情報(tech)が存在する場合のみ、配列に追加
      if (m2m && tech) {
        currentWork.worksToTechs.push({
          ...m2m,
          tech: tech,
        });
      }
      
      return acc;
    }, [] as any[]);

    return result;
  }),
});