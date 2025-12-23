/**
 * Supabase接続テストスクリプト
 * 
 * 学習ポイント:
 * - データベース接続の確認方法
 * - エラーハンドリングの基本
 * - 非同期処理の実装
 * 
 * 実行方法:
 * npx tsx scripts/test-connection.ts
 */

import { db } from '../src/db';
import { users } from '../src/db/schema';

async function testConnection() {
  console.log('🔌 Supabaseへの接続をテスト中...\n');

  try {
    // 接続テスト: usersテーブルから1件取得を試みる
    const result = await db.select().from(users).limit(1);

    console.log('✅ 接続成功!');
    console.log(`📊 usersテーブルのレコード数: ${result.length}件\n`);

    if (result.length > 0) {
      console.log('最初のユーザー:');
      console.log(result[0]);
    } else {
      console.log('💡 ヒント: usersテーブルは空です。');
      console.log('   UserExampleコンポーネントでユーザーを作成してみましょう!');
    }

  } catch (error) {
    console.error('❌ 接続エラーが発生しました:\n');

    if (error instanceof Error) {
      console.error('エラーメッセージ:', error.message);

      // よくあるエラーの解決方法を提示
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        console.log('\n💡 解決方法:');
        console.log('1. .envファイルのDATABASE_URLが正しいか確認');
        console.log('2. Supabaseプロジェクトが起動しているか確認');
        console.log('3. ネットワーク接続を確認');
      } else if (error.message.includes('password authentication failed')) {
        console.log('\n💡 解決方法:');
        console.log('1. .envファイルのパスワードが正しいか確認');
        console.log('2. [YOUR-PASSWORD]の部分を実際のパスワードに置き換えているか確認');
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('\n💡 解決方法:');
        console.log('1. マイグレーションを実行: npm run db:generate');
        console.log('2. マイグレーションを適用: npm run db:migrate');
      }
    }
  }
}

// スクリプト実行
testConnection()
  .then(() => {
    console.log('\n✨ テスト完了!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 予期しないエラー:', error);
    process.exit(1);
  });
