import { initTRPC } from '@trpc/server';
import { db } from '@/db';

/**
 * 学習ポイント:
 * - Context: 各リクエストで利用可能なデータ(DB接続など)
 * - t: tRPCの基本インスタンス
 * - publicProcedure: 認証不要のプロシージャ
 */

// tRPCのコンテキストを定義
// ここでDBインスタンスなどを渡す
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

// tRPCインスタンスの初期化
const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();

/**
 * エクスポートする主要な要素:
 * - router: ルーターを作成するための関数
 * - publicProcedure: 誰でもアクセスできるプロシージャ
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
