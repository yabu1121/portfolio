/*
 * 公開サイトが配っている npm 依存のライセンス表記を集める。
 *
 * **実行は手動。** ビルドのたびに走らせると、依存が変わっていないのに
 * 差分が出て毎回コミットが汚れる。依存を足したときに
 *   npm run licenses
 * を叩いて、出た JSON を一緒にコミットする。
 *
 * 対象は公開している 3 つ（portfolio / blog / slides）。admin は
 * Cloudflare Access の内側で自分しか開かないので配布に当たらない。
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const SITES = ['portfolio', 'blog', 'slides'];
/*
 * 出すのは 2 つ。
 *   summary.json ... ページが読む要約（ライセンスごとの件数）。小さい
 *   notices.txt  ... 全件の表記。**ページには埋め込まない。**
 *                    1000 件を React で描くと HTML が 1MB を超える。
 *                    素のテキストなら 60KB 程度で、読む側も検索しやすい
 */
const SUMMARY_OUT = join(HERE, '..', 'src/app/(main)/licenses/summary.json');
const NOTICES_OUT = join(HERE, '..', 'public/licenses/notices.txt');

/*
 * そのサイト自身のパッケージは一覧に出さない。
 * フォルダ名と package.json の name は一致しないことがあるので
 * （slides の中身は slidev-template）、name を読んで判断する。
 */
const selfNames = new Set(
  SITES.map((site) => {
    const file = join(ROOT, site, 'package.json');
    if (!existsSync(file)) return null;
    return JSON.parse(readFileSync(file, 'utf8')).name;
  }).filter(Boolean),
);

const isSelf = (name) => [...selfNames].some((self) => name.startsWith(`${self}@`));

const collect = (site) => {
  const cwd = join(ROOT, site);
  if (!existsSync(join(cwd, 'node_modules'))) {
    console.warn(`[licenses] ${site}: node_modules が無いので飛ばします`);
    return [];
  }

  const raw = execFileSync(
    'npx',
    ['--yes', 'license-checker-rseidelsohn', '--production', '--json', '--nopeer'],
    { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
  );

  return Object.entries(JSON.parse(raw))
    .filter(([name]) => !isSelf(name))
    .map(([name, info]) => {
      // "pkg@1.2.3" / "@scope/pkg@1.2.3" の両方を分ける
      const at = name.lastIndexOf('@');
      return {
        name: name.slice(0, at),
        version: name.slice(at + 1),
        license: Array.isArray(info.licenses) ? info.licenses.join(' / ') : (info.licenses ?? 'UNKNOWN'),
        repository: info.repository ?? null,
        publisher: info.publisher ?? null,
      };
    });
};

const byName = new Map();
for (const site of SITES) {
  for (const pkg of collect(site)) {
    // 同じパッケージが複数サイトに入っていても 1 行にまとめる
    const key = `${pkg.name}@${pkg.version}`;
    if (!byName.has(key)) byName.set(key, { ...pkg, sites: [] });
    byName.get(key).sites.push(site);
  }
}

const packages = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));

const summary = packages.reduce((acc, pkg) => {
  acc[pkg.license] = (acc[pkg.license] ?? 0) + 1;
  return acc;
}, {});

const generatedAt = new Date().toISOString().slice(0, 10);

writeFileSync(
  SUMMARY_OUT,
  `${JSON.stringify({ generatedAt, total: packages.length, summary }, null, 2)}\n`,
);

const lines = [
  'y4bu.net が使っているソフトウェアの表記',
  '',
  `生成日: ${generatedAt}`,
  `対象: ${SITES.join(' / ')}（本番の依存のみ）`,
  `件数: ${packages.length}`,
  '',
  'どれも著作権表示を残すことが条件のライセンスです。',
  '各パッケージの本文は repository のリポジトリにあります。',
  '',
  '='.repeat(72),
  '',
  ...packages.map((pkg) =>
    [
      `${pkg.name}@${pkg.version}`,
      `  license: ${pkg.license}`,
      pkg.publisher ? `  author:  ${pkg.publisher}` : null,
      pkg.repository ? `  source:  ${pkg.repository}` : null,
      `  used by: ${pkg.sites.join(', ')}`,
      '',
    ]
      .filter(Boolean)
      .join('\n'),
  ),
];

mkdirSync(dirname(NOTICES_OUT), { recursive: true });
writeFileSync(NOTICES_OUT, `${lines.join('\n')}\n`);

console.log(`[licenses] ${packages.length} 件`);
console.log(`  ${SUMMARY_OUT}`);
console.log(`  ${NOTICES_OUT}`);
for (const [license, count] of Object.entries(summary).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(4)}  ${license}`);
}
