-- techs.kind の初期値を埋める。
-- カラム追加時のデフォルトは 'library' なので、それ以外に該当するものだけ UPDATE する。
-- 実行後、最後の SELECT で 'library' のまま残っているものを確認して手当てすること。

UPDATE techs SET kind = 'language'
WHERE name IN ('TypeScript', 'Go', 'Python', 'Java', 'C', 'C++');

UPDATE techs SET kind = 'framework'
WHERE name IN ('Nextjs', 'Next.js', 'React', 'Echo', 'Hono', 'FastAPI');

UPDATE techs SET kind = 'database'
WHERE name IN ('PostgreSQL', 'SQLite', 'MySQL');

UPDATE techs SET kind = 'infra'
WHERE name IN ('Docker', 'Vercel', 'Supabase');

-- 残りは 'library' のままでよい想定:
--   tRPC / Drizzle / GORM / Prisma / Tailwind CSS / Zod / Zustand / JWT / Slack API など

-- 確認用
SELECT kind, count(*), string_agg(name, ', ' ORDER BY name)
FROM techs
GROUP BY kind
ORDER BY kind;
