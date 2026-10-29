'use client'

import Link from "next/link"
import { useCurrentPath } from '@/app/utils/path'
import { links } from "@/app/utils/data"

/*
 * 狭い画面の下部ナビ。ヘッダーと同じ並び（@/app/utils/data の links）を使う。
 *
 * 以前は /links という項目があったが、そのルートは存在せず 404 だった。
 * 並びを links に一本化して、増減が 1 箇所で済むようにした。
 */

const Footer = () => {
  const pathname = useCurrentPath()

  const hrefOf = (link: string) => (link === "/" ? "/" : `/${link}`)
  const isActive = (link: string) => (link === "/" ? pathname === "/" : pathname.startsWith(`/${link}`))

  return (
    <footer className="fixed bottom-0 z-30 w-full border-t border-line bg-white/95 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-lg">
        {links.map((item) => (
          <li key={item.id} className="flex-1">
            <Link
              href={hrefOf(item.link)}
              aria-current={isActive(item.link) ? "page" : undefined}
              className="relative flex flex-col items-center gap-0.5 py-3"
            >
              {/* 現在地の芯。上辺に出す */}
              {isActive(item.link) && <span className="absolute top-0 h-[2px] w-8 bg-sky" />}
              <span
                className={`font-mono text-[10px] tracking-wider ${
                  isActive(item.link) ? "text-sky-ink" : "text-ink-3"
                }`}
              >
                {item.topic.toUpperCase()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  )
}

export default Footer
