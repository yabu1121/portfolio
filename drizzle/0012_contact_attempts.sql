-- お問い合わせの連投を止めるための数取り。
-- 送る前に 1 つ予約して、その結果を見て弾く（詳しくは schema.ts のコメント）。
CREATE TABLE IF NOT EXISTS "contact_attempts" (
  "ip" varchar(64) NOT NULL,
  "window_start" timestamp with time zone NOT NULL,
  "count" integer DEFAULT 0 NOT NULL,
  CONSTRAINT "contact_attempts_ip_window_start_pk" PRIMARY KEY("ip","window_start")
);
