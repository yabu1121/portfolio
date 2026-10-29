'use client'

import { useEffect, useRef, useState } from 'react'
import { useConsent } from '@/app/utils/consent-client'
import { askLiked, sendReaction, type Kind } from '@/app/utils/reactions-client'

/*
 * 「よかった」。
 *
 * **数は出さない。** 数えた結果を見るのは作っている本人だけ（admin）で、
 * 読む人に「3 件」と見せても、少ないと押しにくくなるだけ。出すのは
 * 「あなたは押したか」だけ。
 *
 * **同意が無ければ数えない。** 押した手応えは返すが、cookie も置かないし
 * 数も増やさない。断りを出しても読む人にできることは無いので、見た目は
 * 変えない。
 */
export const LikeButton = ({ kind, target }: { kind: Kind; target: string }) => {
  const consent = useConsent()
  const [liked, setLiked] = useState(false)
  const [busy, setBusy] = useState(false)
  // 開発中は effect が 2 回走る。数えるのは 1 回でいい
  const asked = useRef('')

  useEffect(() => {
    if (consent !== 'yes' || asked.current === target) return
    asked.current = target

    // 閲覧を先に送ってから聞く。端末の鍵を配るのは数えるときなので、
    // 同時に投げると配られる前に聞きにいって「押していない」が返る
    void sendReaction(kind, target, 'view')
      .catch(() => {})
      .then(() => askLiked(kind, target))
      .then(setLiked)
      .catch(() => {})
  }, [kind, target, consent])

  const toggle = async () => {
    if (busy) return
    setBusy(true)
    const next = !liked
    setLiked(next) // 先に見た目を変える。往復を待たせない
    if (consent !== 'yes') return setBusy(false) // 数えないだけ。手応えは返す
    try {
      await sendReaction(kind, target, next ? 'like' : 'unlike')
    } catch {
      setLiked(!next) // 通らなかったので戻す
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      className={`inline-flex items-center gap-2 border px-4 py-2 font-mono text-[11px] tracking-wider transition-colors ${
        liked
          ? 'border-sky bg-sky-soft text-sky-ink'
          : 'border-line bg-white text-ink-3 hover:border-sky hover:text-sky-ink'
      }`}
    >
      <span aria-hidden className="text-[13px] leading-none">
        {liked ? '♥' : '♡'}
      </span>
      {liked ? 'ありがとう' : 'よかった'}
    </button>
  )
}
