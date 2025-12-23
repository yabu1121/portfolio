import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createTRPCContext } from '@/server/trpc';

/**
 * 学習ポイント:
 * - Next.js App RouterのRoute Handlerを使用
 * - すべてのtRPCリクエストを1つのエンドポイントで処理
 * - fetchRequestHandlerでHTTPリクエストをtRPCに変換
 */

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
  });

// GETとPOSTの両方を同じハンドラーで処理
export { handler as GET, handler as POST };
