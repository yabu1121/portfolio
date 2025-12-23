import { createTRPCRouter } from '../trpc';
import { userRouter } from './user';

/**
 * 学習ポイント:
 * - 複数のルーターを1つに統合
 * - APIの名前空間を作成(例: api.user.getAll())
 * - 型定義をエクスポートしてクライアントで使用
 */

export const appRouter = createTRPCRouter({
  user: userRouter,
  // 他のルーターをここに追加
  // post: postRouter,
  // comment: commentRouter,
});

// 型定義をエクスポート(クライアント側で使用)
export type AppRouter = typeof appRouter;
