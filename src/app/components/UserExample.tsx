'use client';

import { api } from '@/trpc/client';
import { useState } from 'react';

/**
 * 学習ポイント:
 * - useQuery: データを取得し、自動的にキャッシュ・再取得を管理
 * - useMutation: データを変更する操作
 * - invalidate: キャッシュを無効化して再取得
 */

export default function UserExample() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // データ取得
  const { data: users, isLoading, error } = api.user.getAll.useQuery();

  // ユーザー作成のMutation
  const utils = api.useUtils();
  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      // 成功したらユーザーリストを再取得
      utils.user.getAll.invalidate();
      setName('');
      setEmail('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate({ name, email });
  };

  if (isLoading) {
    return <div className="p-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">エラー: {error.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">tRPC + Drizzle 実装例</h1>

      {/* ユーザー作成フォーム */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">新規ユーザー作成</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createUser.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {createUser.isPending ? '作成中...' : 'ユーザーを作成'}
          </button>
        </form>
      </div>

      {/* ユーザー一覧 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">ユーザー一覧</h2>
        {users && users.length > 0 ? (
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="border-b pb-2">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">ユーザーがまだ登録されていません</p>
        )}
      </div>
    </div>
  );
}
