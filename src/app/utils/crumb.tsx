'use client'

import { useEffect, useSyncExternalStore } from 'react'

/*
 * パンくずの末尾に出す名前。
 *
 * **ページ側から渡す。** 帯（Header）はパスしか知らないので、
 * /projects/<uuid>/detail からは「作品」までしか組めない。どの作品を
 * 見ているかは中身を引いたページだけが知っているので、ここに置いて
 * 帯に拾わせる。
 *
 * **サーバでは空。** 作り置きしたページを配っているので、最初の描画は
 * どの作品でも同じ HTML でなければならない（違うと hydration が壊れる）。
 * 名前が出るのは画面が動き出してから。
 */

let leaf: string | null = null
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((listen) => listen())

const subscribe = (listen: () => void) => {
  listeners.add(listen)
  return () => {
    listeners.delete(listen)
  }
}

/** 帯の側で読む */
export const useCrumbLeaf = () =>
  useSyncExternalStore(
    subscribe,
    () => leaf,
    () => null,
  )

/** ページの中に置く。画面には何も出さない */
export const CrumbLeaf = ({ title }: { title: string }) => {
  useEffect(() => {
    leaf = title
    emit()
    return () => {
      leaf = null
      emit()
    }
  }, [title])

  return null
}
