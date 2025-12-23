import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';

/**
 * 学習ポイント:
 * - createTRPCReact: Reactフック用のtRPCクライアント
 * - AppRouter型を使用して完全な型安全性を実現
 * - このapiオブジェクトをコンポーネントで使用
 */

// 型付きtRPCフック
export const api = createTRPCReact<AppRouter>();
