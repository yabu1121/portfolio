import { initTRPC, TRPCError } from '@trpc/server';
import { db } from '@/db';
import { verifyBasicAuth } from '@/lib/auth';

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

const isAdmin = t.middleware(({ctx, next}) => {
  if(!verifyBasicAuth(ctx.headers.get('authorization'))) {
    throw new TRPCError({code: 'UNAUTHORIZED', message: 'Auth required'})
  }

  return next({ctx})
})

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure.use(isAdmin)
