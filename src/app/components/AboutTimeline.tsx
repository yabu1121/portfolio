'use client'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { api } from '@/trpc/client'
import Section from './common/Section'
import Error from './common/Error'
import LinkPreview from './common/LinkPreview'
import { formatTimelinePeriod } from '@/app/utils/timelineDate'

// 外部リンクの種類はホスト名で判別する。項目ごとにラベルを持たせるより、
// URL を1つ登録するだけで済む方が運用が楽なため。
const LINK_LABEL_BY_HOST: Record<string, string> = {
  'speakerdeck.com': 'スライド',
  'zenn.dev': '記事',
  'qiita.com': '記事',
  'github.com': 'リポジトリ',
}

const linkLabel = (url: string) => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return LINK_LABEL_BY_HOST[host] ?? host
  } catch {
    return 'リンク'
  }
}

// 読み込み中は生テキストではなく、実際の項目と同じ骨格を出して
// データ到着時のガタつきを抑える。
const TimelineSkeleton = () => (
  <ol className="ml-2 space-y-4 border-l-2 border-slate-200 sm:ml-3 md:ml-6">
    {[0, 1, 2].map((i) => (
      <li key={i} className="relative pl-8 md:pl-12">
        <span className="absolute left-0 top-2 size-3 -translate-x-1/2 rounded-full bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="h-4 w-24 rounded bg-slate-100" />
          <div className="h-4 w-12 rounded-full bg-slate-100" />
          <div className="h-4 w-40 rounded bg-slate-100" />
        </div>
      </li>
    ))}
  </ol>
)

const AboutTimeline = () => {
  const { data: timeline, isLoading, error } = api.timeline.getAllForPublic.useQuery()

  // 年ごとに束ねる。一列で流すと目的の時期を探しにくいので、
  // 年を見出しにして視線の足がかりを作る。
  const byYear = (timeline ?? []).reduce<Record<string, NonNullable<typeof timeline>>>(
    (acc, item) => {
      (acc[item.year] ??= []).push(item)
      return acc
    },
    {},
  )
  const years = Object.keys(byYear).sort()

  return (
    <Section className="bg-white rounded">
      <header className="mb-10">
        <h2 className="mb-2 text-2xl font-medium">Timeline</h2>
        <p className="text-sm text-slate-500">これまでの経歴（項目をクリックすると詳細が開きます）</p>
      </header>

      {isLoading ? (
        <TimelineSkeleton />
      ) : error ? (
        <Error error={error} />
      ) : (
        <div className="space-y-8">
          {years.map((year) => (
            <section key={year}>
              <h3
                style={{ fontFamily: 'var(--font-geist-mono)' }}
                className="mb-3 text-sm font-medium tabular-nums text-slate-400"
              >
                {year}
              </h3>

              <ol className="ml-2 space-y-4 border-l-2 border-slate-200 sm:ml-3 md:ml-6">
                {byYear[year].map((item) => (
                  <li
                    key={`${item.year}-${item.month}-${item.title}`}
                    className="group relative pl-8 md:pl-12"
                  >
                    {/* 線の上に乗る点。ring はレイアウトに影響しないので hover で色だけ変える */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-2 size-3 -translate-x-1/2 rounded-full bg-white ring-2 ring-slate-300 transition-colors group-hover:ring-sky-500"
                    />

                    {/* details/summary を使うと開閉のキーボード操作とフォーカスがブラウザ標準で効く */}
                    <details className="group/detail">
                      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        {/* 日付の長さが「2024.10」から「2026.08.31 – 2026.09.04」まで幅広いので、
                            広い画面では固定幅の列に入れてタイトルの開始位置を揃える。
                            狭い画面では列をやめて上下に積む。 */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-1 flex-col gap-y-1 sm:flex-row sm:items-baseline sm:gap-x-4">
                            {/* 狭い画面では日付とタグを同じ行に。広い画面では sm:contents で
                                外側の flex に展開し、それぞれを固定幅の列として扱う。 */}
                            <span className="flex shrink-0 items-baseline gap-3 sm:contents">
                              <span
                                style={{ fontFamily: 'var(--font-geist-mono)' }}
                                className="shrink-0 text-xs font-medium tabular-nums text-sky-700 sm:w-48"
                              >
                                {formatTimelinePeriod(item)}
                              </span>

                              {/* タグは幅が揃うよう固定幅の枠に入れる（中のピルは自然幅のまま） */}
                              <span className="shrink-0 sm:w-20">
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                  {item.category}
                                </span>
                              </span>
                            </span>

                            <h4 className="min-w-0 text-balance font-bold text-slate-800 transition-colors group-hover:text-sky-700">
                              {item.title}
                            </h4>
                          </div>

                          <ChevronDown
                            aria-hidden
                            className="mt-0.5 size-4 shrink-0 text-slate-400 transition-transform duration-150 group-open/detail:rotate-180"
                          />
                        </div>
                      </summary>

                      {/* 展開後は幅を優先してインデントしない。タイトルと左端は揃わなくなるが、
                          本文と図に使える幅が 480px → 784px に広がる。 */}
                      <div>
                      {/* whitespace-pre-line で管理画面のtextareaで入れた改行をそのまま反映する。
                          連続する空白は畳まれるのでインデントの混入は気にしなくてよい。 */}
                      <p className="mt-2 whitespace-pre-line text-pretty text-sm leading-relaxed text-slate-600">
                        {item.detail}
                      </p>

                      {/* 動きのある成果物。details の中なので、開くまで再生は始まらない。
                          controls を付けて、動きを止めたい人が止められるようにしている。 */}
                      {item.videoUrl && (
                        <video
                          src={item.videoUrl}
                          className="mt-3 w-full rounded-lg border border-slate-200 bg-white"
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls
                          preload="metadata"
                        />
                      )}

                      {/* 成果物の図。文章だけでは伝わらない可視化を、展開したときだけ見せる。
                          1枚なら全幅、2枚以上なら横並びにする。 */}
                      {item.imageUrls && item.imageUrls.length > 0 && (
                        <ul
                          className={`mt-3 grid gap-3 ${
                            item.imageUrls.length > 1 ? 'sm:grid-cols-2' : ''
                          }`}
                        >
                          {item.imageUrls.map((src) => (
                            <li key={src}>
                              <a href={src} target="_blank" rel="noopener noreferrer">
                                <Image
                                  src={src}
                                  alt={`${item.title} の図`}
                                  width={800}
                                  height={600}
                                  className="w-full rounded-lg border border-slate-200 bg-white transition-colors hover:border-sky-300"
                                />
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* リンクは summary の外（展開後）に置く。summary 内に <a> を入れると
                          クリックが開閉と競合するため。 */}
                      {item.urls?.map((u) => (
                        <LinkPreview key={u} url={u} fallbackLabel={linkLabel(u)} />
                      ))}
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </Section>
  )
}

export default AboutTimeline
