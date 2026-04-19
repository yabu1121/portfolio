import { initTRPC, TRPCError } from '@trpc/server';
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

const isAdmin = t.middleware(({ctx, next}) => {
  const auth = ctx.headers.get('authorization');
  if(!auth){
    throw new TRPCError({code: 'UNAUTHORIZED', message: 'Auth required'})
  }
  const [user, pass] = atob(auth.split('')[1]).split(':');
  if(user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASSWORD) {
    throw new TRPCError({code: 'UNAUTHORIZED', message: 'invalid credentials'})
  }

  return next({ctx})
})

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure.use(isAdmin)
