'use client'
import { ExternalLink } from 'lucide-react'
import { api } from '@/trpc/client'

// 外部リンクをOGPカードで見せる。取得中・取得失敗でも「素のリンク」として
// 必ず成立させるので、プレビューが出ないことがそのまま導線の欠落にはならない。
// 画像のホストは登録するURL次第で変わるため next/image ではなく <img> を使う
// （remotePatterns にホストを足して回る運用を避ける）。

type Props = {
  url: string
  /** プレビューが取れないときのリンク文言 */
  fallbackLabel: string
}

const LinkPreview = ({ url, fallbackLabel }: Props) => {
  const { data } = api.link.preview.useQuery(
    { url },
    { staleTime: 1000 * 60 * 60 },
  )

  if (!data) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-sky-200 px-3 py-1.5 text-sm font-medium text-sky-700 transition-colors hover:border-sky-400 hover:bg-sky-50"
      >
        <ExternalLink aria-hidden className="size-4" />
        {fallbackLabel}を見る
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-sky-300 hover:shadow-md sm:flex-row"
    >
      {data.image && (
        <span className="shrink-0 bg-slate-50 sm:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image}
            alt=""
            loading="lazy"
            className="aspect-video h-full w-full object-cover"
          />
        </span>
      )}

      <span className="flex min-w-0 flex-col justify-center gap-1 p-4">
        <span className="line-clamp-2 text-sm font-bold text-slate-800">
          {data.title ?? url}
        </span>
        {data.description && (
          <span className="line-clamp-2 text-xs leading-relaxed text-slate-500">
            {data.description}
          </span>
        )}
        <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
          <ExternalLink aria-hidden className="size-3" />
          {data.siteName}
        </span>
      </span>
    </a>
  )
}

export default LinkPreview
