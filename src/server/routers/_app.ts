import { createTRPCRouter } from '../trpc';
import { workRouter } from './work';

/**
 * 学習ポイント:
 * - 複数のルーターを1つに統合
 * - APIの名前空間を作成(例: api.work.getAll())
 * - 型定義をエクスポートしてクライアントで使用
 */

export const appRouter = createTRPCRouter({
  work: workRouter,
  // 他のルーターをここに追加
  // post: postRouter,
  // comment: commentRouter,
});

// 型定義をエクスポート(クライアント側で使用)
export type AppRouter = typeof appRouter;
