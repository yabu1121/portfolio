import { createTRPCRouter, publicProcedure } from "../trpc";
import { works, m2m_worksToTechs, techs } from "@/db/schema"; 
import { desc, eq } from "drizzle-orm";

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    // 1. 各テーブルの結果を「オブジェクト単位」で受け取る
    // これにより、テーブル間で重複するカラム名（id, description等）が正しく区別されます。
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

    // 2. フラットな実行結果をネスト構造に整形（Reduce）
    // DB側でJSON化（db.query）するのではなく、Node.js側で組み立てるのが最も安全です。
    const result = rows.reduce((acc, row) => {
      const workId = row.work.id;
      
      // すでにこの制作物が配列にあるか確認
      let currentWork = acc.find((w) => w.id === workId);

      if (!currentWork) {
        // 初めて登場する Work なら、初期構造を作成（db.query の時と型を合わせる）
        currentWork = { ...row.work, worksToTechs: [] };
        acc.push(currentWork);
      }

      // 紐づく技術情報があれば追加
      if (row.m2m && row.tech) {
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