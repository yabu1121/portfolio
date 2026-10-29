import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Metadata } from 'next'
import { GutterMascots } from '@/app/components/common/GutterMascots'
import { FONTS, OFL_URL, oflHref } from './fonts'
import data from './summary.json'

/*
 * ライセンス表記。
 *
 * **ここは義理ではなく条件を満たすための場所。**
 *   書体 ... woff2 を自前で配っている＝再配布なので、SIL OFL 2 項により
 *            著作権表示とライセンス本文が要る。本文は各サイトの
 *            public/fonts/OFL-*.txt に置き、ここからは著作権表示と
 *            本文へのリンクを出す。
 *   npm  ... ブラウザに配るバンドルに MIT / BSD などのコードが混ざる。
 *            どれも「著作権表示を残すこと」が条件なので、全部挙げる。
 *
 * 依存は scripts/collect-licenses.mjs が作る要約を読むだけ。全件は
 * public/licenses/notices.txt に素のテキストで置いている。**ページに
 * 埋め込まない。** 1000 件を React で描くと HTML が 1MB を超えるので、
 * テキストなら 136KB で済み、読む側も検索しやすい。
 * **ビルド時に数えない。** 依存が変わっていないのに差分が出るのと、
 * ビルドのたびに npx を走らせたくないため。依存を足したら
 * npm run licenses を叩いて一緒にコミットする。
 */

export const metadata: Metadata = {
  title: 'ライセンス | Hayato\'s Portfolio',
  description: 'このサイトが使っている書体とソフトウェアの表記',
}

const SITE_LABEL: Record<string, string> = {
  portfolio: 'www',
  blog: 'blog',
  slides: 'slides',
}

/** OFL 本文の 1 行目が著作権表示になっている */
const copyrightOf = async (file: string) => {
  const text = await readFile(join(process.cwd(), 'public/fonts', file), 'utf8').catch(() => '')
  return text.split('\n')[0]?.trim() || null
}

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-surface px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-ink-3">
    {children}
  </span>
)

export default async function LicensesPage() {
  const fonts = await Promise.all(
    FONTS.map(async (font) => ({ ...font, copyright: await copyrightOf(font.file) })),
  )

  const summary = Object.entries(data.summary).sort((a, b) => b[1] - a[1])

  return (
    <div className="paper min-h-screen">
      <section className="relative mx-auto w-full max-w-3xl px-5 pt-24 pb-28">
        <GutterMascots items={[{ pose: 'thinking', side: 'left', top: 120, width: 120 }]} />

        <header>
          <p className="font-mono text-[11px] tracking-widest text-ink-3">LICENSES</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">ライセンス</h1>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink-2">
            このサイト（www / blog / slides）が配っている書体とソフトウェアの表記です。
          </p>
        </header>

        {/* 書体 */}
        <section className="mt-16">
          <h2 className="font-mono text-[10px] tracking-widest text-ink-3">FONTS</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
            いずれも{' '}
            <a href={OFL_URL} target="_blank" rel="noreferrer" className="underline hover:text-sky-ink">
              SIL Open Font License 1.1
            </a>
            。woff2 を自前で配っているので、著作権表示と本文を添えています。
          </p>

          <ul className="mt-5 grid gap-2 md:grid-cols-2">
            {fonts.map((font) => (
              <li key={font.name} className="border border-line bg-white px-4 py-3">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-display text-[15px] font-bold text-ink">{font.name}</span>
                  {font.sites.map((site) => (
                    <Tag key={site}>{SITE_LABEL[site]}</Tag>
                  ))}
                </div>

                {font.copyright && (
                  <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-ink-2">
                    {font.copyright}
                  </p>
                )}

                <p className="mt-1.5 flex flex-wrap gap-x-4 font-mono text-[11px]">
                  <a href={oflHref(font)} className="text-ink-3 underline hover:text-sky-ink">
                    ライセンス本文
                  </a>
                  <a
                    href={font.project}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-3 underline hover:text-sky-ink"
                  >
                    プロジェクト
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* npm */}
        <section className="mt-16">
          <h2 className="font-mono text-[10px] tracking-widest text-ink-3">SOFTWARE</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
            3 つのサイトが使っている npm の依存 {data.total} 件です（{data.generatedAt} 時点）。
            どれも著作権表示を残すことが条件なので、全部挙げています。
          </p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {summary.map(([license, count]) => (
              <li
                key={license}
                className="flex items-center gap-2 border border-line bg-white px-2.5 py-1 font-mono text-[11px]"
              >
                <span className="text-ink-2">{license}</span>
                <span className="text-ink-3">{count}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6">
            <a
              href="/licenses/notices.txt"
              className="inline-flex items-center gap-2 border border-line bg-white px-4 py-2.5 font-mono text-[11px] tracking-wider text-ink-2 transition-colors hover:border-sky hover:text-sky-ink"
            >
              全件の表記を見る（{data.total} 件）→
            </a>
          </p>
        </section>
      </section>
    </div>
  )
}
