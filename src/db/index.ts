import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * 学習ポイント:
 * - postgres-jsを使用してPostgreSQLに接続
 * - drizzle()でORMインスタンスを作成
 * - スキーマを渡すことで型安全なクエリが可能に
 */

// 環境変数からデータベースURLを取得
const connectionString = process.env.DATABASE_URL!;

// PostgreSQLクライアントの作成
const client = postgres(connectionString);

// DrizzleのORMインスタンスを作成
export const db = drizzle(client, { schema });
