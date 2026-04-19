import { createTRPCRouter } from '../trpc';
import { skillRouter } from './skills';
import { workRouter } from './work';
import { mailRouter } from './mail';

/**
 * 学習ポイント:
 * - 複数のルーターを1つに統合
 * - APIの名前空間を作成(例: api.work.getAll())
 * - 型定義をエクスポートしてクライアントで使用
 */

export const appRouter = createTRPCRouter({
  work: workRouter,
  skill: skillRouter,
  mail: mailRouter,
});

// 型定義をエクスポート(クライアント側で使用)
export type AppRouter = typeof appRouter;
