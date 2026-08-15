# portfolio

ポートフォリオサイト。作品・スキル・経歴を掲載しています。

https://y4bu.net

## 特徴

- 作品／スキル／タイムラインのデータは管理画面から更新でき、コードを触らずに内容を差し替えられます
- 作品ごとに使用技術を紐付け、「その技術を何にどう使ったか」を作品詳細ページで見せる構成にしています
- お問い合わせフォームは nodemailer でメール送信

## 技術スタック

| 領域 | 技術 |
| --- | --- |
| フレームワーク | Next.js (App Router) |
| 型安全なAPI | tRPC + Zod |
| DB / ORM | Supabase (PostgreSQL) + Drizzle ORM |
| スタイリング | Tailwind CSS |
| デプロイ | Vercel（`master` への push で自動デプロイ） |

## 構成

```
src/app/(main)/      公開ページ（Home / About / Projects / Contact）
src/app/admin/       管理画面
src/server/routers/  tRPC ルーター（work / tech / skill / timeline / event）
drizzle/             マイグレーション
```

## 開発

```sh
npm install
npm run dev
```
