-- 2026.04 Findy 学生LT の項目に登壇資料を紐づける。
-- 資料: 「私が陥っていたCRUD管理地獄からの脱出」/ 那須隼人 / 2026-04-17 / 28枚

UPDATE timeline
SET url = 'https://speakerdeck.com/hayato_1121/watashi-ga-ochii-te-ita-crud-kanri-jigoku-karano-dasshutsu',
    day = 17
WHERE year = '2026' AND month = 4 AND category = 'talk';

-- 任意: 現在の detail は「インプット中心からアウトプットへ。」だけで
-- 何を話したのかが分からないので、中身に触れるなら以下も実行する。
--
-- UPDATE timeline
-- SET detail = '「私が陥っていたCRUD管理地獄からの脱出」というタイトルで登壇。'
--              || 'CRUDの管理画面を作る練習を繰り返しても実際の課題は解けていないと気づき、'
--              || 'データ操作の上に載るUXや固有のアルゴリズムこそが価値になる、という整理を話した。'
--              || 'インプット中心からアウトプットへ切り替えた起点。'
-- WHERE year = '2026' AND month = 4 AND category = 'talk';

-- 確認用
SELECT year, month, day, category, title, url
FROM timeline
WHERE url IS NOT NULL
ORDER BY year, month, day;
