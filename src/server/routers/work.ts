import { createTRPCRouter, publicProcedure } from "../trpc";
import { works, m2m_worksToTechs, techs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    /**
     * 学習ポイント:
     * - Relational Query API (db.query) を使用
     * - 手動でのJOINやreduceが不要になり、コードが宣言的で読みやすくなる
     * - "with" オプションで関連テーブルをネストして取得可能
     * - Drizzleが内部で最適なクエリ生成とレスポンスのマッピングを行うため、
     *   カラム名の衝突によるパースエラーなどを回避できる
     */
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