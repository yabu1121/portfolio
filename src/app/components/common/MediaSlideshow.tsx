'use client'

import Image from 'next/image'
import { useState } from 'react'

/*
 * 作品のメディアを捲って見せる。詳細ページだけに出す
 * （一覧に置くと 6 作品ぶんの画像と動画を最初に全部読むことになる）。
 *
 * **1 枚しか無ければ捲る道具は出さない。** ボタンだけあって動かないのは
 * 壊れて見える。
 *
 * 動画は自動再生しない。音は無いが、開いた瞬間に動き出すと文章が読めない。
 * アニメ gif は止められないので、動くものだと分かるよう印を付ける。
 */

export type Media = {
  id: string
  url: string
  /** image | gif | video。描き方が変わる */
  kind: string
  caption: string | null
}

const KIND_LABEL: Record<string, string> = {
  gif: 'ANIMATION',
  video: 'VIDEO',
}

export const MediaSlideshow = ({ items, title }: { items: Media[]; title: string }) => {
  const [at, setAt] = useState(0)

  if (!items.length) return null

  // 消された URL などで範囲外になっても落ちないようにする
  const index = Math.min(at, items.length - 1)
  const current = items[index]
  const many = items.length > 1

  const move = (step: number) => setAt((prev) => (prev + step + items.length) % items.length)

  return (
    <div>
      <div className="relative border border-line bg-surface">
        {/* 枠は 16:9 で固定する。捲るたびに高さが変わると下の文章が飛ぶ */}
        <div className="relative aspect-video w-full overflow-hidden">
          {current.kind === 'video' ? (
            <video
              key={current.id}
              src={current.url}
              controls
              playsInline
              preload="metadata"
              className="size-full object-contain"
            />
          ) : (
            <Image
              key={current.id}
              src={current.url}
              alt={current.caption ?? title}
              fill
              // 縦長・横長が混ざるので、切らずに収める
              className="object-contain"
              unoptimized={current.kind === 'gif'}
            />
          )}
        </div>

        {KIND_LABEL[current.kind] && (
          <span className="absolute left-2 top-2 bg-white/90 px-2 py-0.5 font-mono text-[10px] tracking-wider text-ink-3">
            {KIND_LABEL[current.kind]}
          </span>
        )}

        {many && (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="前へ"
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center border border-line bg-white/90 font-mono text-ink-2 transition-colors hover:border-sky hover:text-sky-ink"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="次へ"
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center border border-line bg-white/90 font-mono text-ink-2 transition-colors hover:border-sky hover:text-sky-ink"
            >
              ›
            </button>
          </>
        )}
      </div>

      {(current.caption || many) && (
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
          <p className="min-w-0 text-[13px] leading-relaxed text-ink-2">{current.caption}</p>

          {many && (
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-mono text-[10px] tabular-nums text-ink-3">
                {index + 1} / {items.length}
              </span>
              <ul className="flex gap-1.5">
                {items.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setAt(i)}
                      aria-label={`${i + 1} 枚目`}
                      aria-current={i === index}
                      className={`block h-1.5 w-5 transition-colors ${
                        i === index ? 'bg-sky-ink' : 'bg-line hover:bg-sky'
                      }`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
