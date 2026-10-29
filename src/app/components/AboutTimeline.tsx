import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Section, { SectionHead } from './common/Section'
import { DeckCard } from './common/DeckCard'
import LinkPreview from './common/LinkPreview'
import { formatTimelinePeriod } from '@/app/utils/timelineDate'
import { listTimelineForPublic } from '@/lib/about'

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

const AboutTimeline = async () => {
  const timeline = await listTimelineForPublic()

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
    <Section className="border-t border-line">
      <SectionHead en="Timeline" title="経歴" note="押すと詳しく出ます" />

      <div className="space-y-8">
          {years.map((year) => (
            /*
              **年は左の柱に置く。** 丸い点を線の上に並べる形はどこでも
              見かけるうえ、点とタイトルの間が空くだけで読みやすくはない。
              年を柱にして、その年の出来事を右に積む。
            */
            <section key={year} className="grid gap-x-6 sm:grid-cols-[4rem_1fr]">
              <h3
                style={{ fontFamily: 'var(--font-geist-mono)' }}
                className="mb-2 font-mono text-[15px] tabular-nums text-ink-3 sm:mb-0 sm:pt-3"
              >
                {year}
              </h3>

              <ol className="divide-y divide-line border-t border-line">
                {byYear[year].map((item) => (
                  <li key={`${item.year}-${item.month}-${item.title}`} className="group py-3">
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
                                className="shrink-0 font-mono text-[11px] tabular-nums text-sky-ink sm:w-48"
                              >
                                {formatTimelinePeriod(item)}
                              </span>

                              {/* 区分は囲わない。小さな札を並べると作り物めいて見える */}
                              <span className="shrink-0 font-mono text-[10px] tracking-wider text-ink-3 sm:w-20">
                                {item.category}
                              </span>
                            </span>

                            <h4 className="min-w-0 text-balance font-display font-black text-ink transition-colors group-hover:text-sky-ink">
                              {item.title}
                            </h4>
                          </div>

                          <ChevronDown
                            aria-hidden
                            className="mt-0.5 size-4 shrink-0 text-ink-3 transition-transform duration-150 group-open/detail:rotate-180"
                          />
                        </div>
                      </summary>

                      {/* 展開後は幅を優先してインデントしない。タイトルと左端は揃わなくなるが、
                          本文と図に使える幅が 480px → 784px に広がる。 */}
                      <div>
                      {/* whitespace-pre-line で管理画面のtextareaで入れた改行をそのまま反映する。
                          連続する空白は畳まれるのでインデントの混入は気にしなくてよい。 */}
                      <p className="mt-2 whitespace-pre-line text-pretty text-sm leading-relaxed text-ink-2">
                        {item.detail}
                      </p>

                    {/* 紐付けたスライド。公開中のものだけ出る */}
                    <DeckCard deck={item} />

                      {/* 動きのある成果物。details の中なので、開くまで再生は始まらない。
                          controls を付けて、動きを止めたい人が止められるようにしている。 */}
                      {item.videoUrl && (
                        <video
                          src={item.videoUrl}
                          className="mt-3 w-full border border-line bg-white"
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
                                  className="w-full border border-line bg-white transition-colors hover:border-sky"
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
    </Section>
  )
}

export default AboutTimeline
