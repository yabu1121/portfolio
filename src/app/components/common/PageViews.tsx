'use client'

import { useEffect, useRef } from 'react'
import { useCurrentPath } from '@/app/utils/path'
import { useConsent } from '@/app/utils/consent-client'
import { sendReaction } from '@/app/utils/reactions-client'

/*
 * ページの閲覧を数える。
 *
 * **描画の外から数える。** ページは作り置きして配っているので、描画の中で
 * 数えると、その場で作り直すことになって作り置きが効かなくなる。
 *
 * **同意が無ければ何もしない。** 数えるのは同意したときだけ。
 */
export const PageViews = () => {
  const pathname = useCurrentPath()
  const consent = useConsent()
  const sent = useRef('')

  useEffect(() => {
    if (consent !== 'yes' || sent.current === pathname) return
    sent.current = pathname
    // どのサイトのパスかが分かるように名前を付ける（slides も / を送るため）
    void sendReaction('page', `www:${pathname}`, 'view').catch(() => {})
  }, [pathname, consent])

  return null
}
