-- 本番DB（既存データあり）を現在の schema.ts に合わせるための追加列。
--
-- なぜ手書きが要るか:
--   drizzle/0000_baseline.sql は全テーブルの CREATE TABLE で、既存DBには当てられない。
--   新しい列は baseline の CREATE 文の中に埋まっていて ALTER が存在しないため、
--   drizzle-kit migrate では本番に反映されない。
--
-- 代替案: DATABASE_URL を設定して `npx drizzle-kit push` を使う。
--   push は稼働中DBと schema.ts を差分比較して ALTER を直接当てる。
--   今回の変更は追加のみなので push でも安全（実行前に差分が表示される）。
--   下のSQLは「何が起きるか」を明示的に確認・レビューしたい場合に使う。

-- techs: 言語 / FW / ライブラリ / DB / インフラ の区別
ALTER TABLE techs ADD COLUMN IF NOT EXISTS kind varchar(20) DEFAULT 'library' NOT NULL;

-- timeline: 期間表現（単発 / 期間 / 継続中）
ALTER TABLE timeline ADD COLUMN IF NOT EXISTS day integer;
ALTER TABLE timeline ADD COLUMN IF NOT EXISTS end_year varchar(4);
ALTER TABLE timeline ADD COLUMN IF NOT EXISTS end_month integer;
ALTER TABLE timeline ADD COLUMN IF NOT EXISTS end_day integer;
ALTER TABLE timeline ADD COLUMN IF NOT EXISTS is_ongoing boolean DEFAULT false NOT NULL;

-- timeline: 登壇資料・記事などの外部リンク
ALTER TABLE timeline ADD COLUMN IF NOT EXISTS url varchar(255);

-- 確認用
SELECT table_name, column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name = 'techs' AND column_name = 'kind')
    OR (table_name = 'timeline' AND column_name IN ('day','end_year','end_month','end_day','is_ongoing','url'))
  )
ORDER BY table_name, column_name;
