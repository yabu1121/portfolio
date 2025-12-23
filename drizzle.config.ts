import type { Config } from 'drizzle-kit';

/**
 * 学習ポイント:
 * - drizzle-kitはマイグレーション管理ツール
 * - schema: スキーマファイルのパス
 * - out: マイグレーションファイルの出力先
 * - dialect: 使用するデータベースの種類
 */

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
