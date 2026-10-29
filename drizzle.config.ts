import type { Config } from 'drizzle-kit';

/*
 * drizzle-kit は Next.js の .env.local を読まないので、ここで自分で読む。
 * Node 22 以降の process.loadEnvFile を使い、dotenv は入れない。
 */
try {
  process.loadEnvFile('.env.local');
} catch {
  // 無ければ既存の環境変数で動かす（CI など）
}

/*
 * マイグレーションは session モード（5432）につなぐ。
 * 実行時の transaction モード（6543）は DDL を流すのに向かない。
 */
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error('DIRECT_URL か DATABASE_URL が必要です');

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
  dbCredentials: { url },
  schemaFilter: ['public'],
} satisfies Config;
