'use client'
import { api } from '@/trpc/client'

/*
 * 外部の記事・スライドを引用するカード。経歴（AboutTimeline）で使う。
 *
 * **取れなくても必ずリンクとして成立させる。** OGP は相手のサイト次第で
 * 落ちるので、取得中も失敗時も 1 行のリンクを出す。カードが出ないことが
 * そのまま導線の欠落にはならない。
 *
 * 角は丸めない・罫は line・差し色は空色 1 つ。サイト全体と同じ約束にしている
 * （以前は rounded-xl / slate / shadow で、ここだけ別のサイトのように見えた）。
 *
 * 画像のホストは登録する URL 次第で変わるので next/image は通さない
 * （remotePatterns にホストを足して回る運用を避ける）。
 */

// 引用元の見分け。ロゴは simpleicons にある slug を使う
const SERVICE_BY_HOST: Record<string, { name: string; slug: string }> = {
  'zenn.dev': { name: 'Zenn', slug: 'zenn' },
  'speakerdeck.com': { name: 'Speaker Deck', slug: 'speakerdeck' },
  'qiita.com': { name: 'Qiita', slug: 'qiita' },
  'github.com': { name: 'GitHub', slug: 'github' },
  'note.com': { name: 'note', slug: 'note' },
  'x.com': { name: 'X', slug: 'x' },
}

const serviceOf = (url: string) => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return SERVICE_BY_HOST[host] ?? { name: host, slug: null }
  } catch {
    return { name: 'リンク', slug: null }
  }
}

/** 引用元の印。ロゴが無いサービスはホスト名だけ出す */
const Source = ({ name, slug }: { name: string; slug: string | null }) => (
  <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-ink-3">
    {slug && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://cdn.simpleicons.org/${slug}`}
        alt=""
        width={11}
        height={11}
        loading="lazy"
        className="size-[11px] shrink-0 opacity-50"
      />
    )}
    {name}
  </span>
)

type Props = {
  url: string
  /** プレビューが取れないときのリンク文言 */
  fallbackLabel: string
}

const LinkPreview = ({ url, fallbackLabel }: Props) => {
  const { data } = api.link.preview.useQuery({ url }, { staleTime: 1000 * 60 * 60 })
  const service = serviceOf(url)

  // 取得中・取得失敗。1 行のリンクとして出す
  if (!data) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 border border-line bg-white px-3 py-1.5 transition-colors hover:border-sky"
      >
        <Source name={service.name} slug={service.slug} />
        <span className="font-mono text-[11px] text-ink-2">{fallbackLabel}を見る →</span>
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-3 flex overflow-hidden border border-line bg-white transition-[border-color,transform] duration-200 hover:-translate-y-[2px] hover:border-sky"
    >
      {data.image && (
        /* 表紙。枠を固定して中に収める（縦横比は引用元ごとにまちまち） */
        <span className="hidden w-40 shrink-0 self-stretch border-r border-line bg-surface sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.image} alt="" loading="lazy" className="size-full object-cover" />
        </span>
      )}

      <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3">
        <span className="line-clamp-2 text-[14px] leading-snug font-bold text-ink group-hover:text-sky-ink">
          {data.title ?? url}
        </span>
        {data.description && (
          <span className="line-clamp-2 text-[12px] leading-relaxed text-ink-2">
            {data.description}
          </span>
        )}
        <span className="mt-0.5">
          <Source name={data.siteName ?? service.name} slug={service.slug} />
        </span>
      </span>
    </a>
  )
}

export default LinkPreview
