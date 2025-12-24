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
    /**
     * 【最終切り分けモード】
     * 複雑なJOINやマッピングを全て排除し、まずは「worksテーブル単体」が取得できるか確認します。
     * これで取得できれば、DB接続はOKで、問題はJOINやカラムの重複にあると確定します。
     */

    // 1. Worksテーブルだけをシンプルに取得（postgres-jsの基本的な動作確認）
    // JOINを全て外し、Aliasも使わず、単純なSELECT * FROM worksを実行
    const worksData = await db
      .select()
      .from(works)
      .orderBy(desc(works.createdAt));

    // 2. クライアントが期待する型に合わせて整形（Techsは空配列で返す）
    // これで動けば、原因はJOIN時のデータ構造パースにあることになります。
    return worksData.map((work) => ({
      ...work,
      worksToTechs: [],
    }));
  }),
});