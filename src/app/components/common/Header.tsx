'use client'

import Link from "next/link"
import { useCurrentPath } from '@/app/utils/path'
import { useCrumbLeaf } from '@/app/utils/crumb'
import { useEffect, useState } from "react"
import { links } from "@/app/utils/data"
import { SITES } from "@/app/utils/siteFooter"

/*
 * 上の細い帯。4 つのアプリ（www / blog / slides / admin）で同じ形にしている。
 *
 *   [☰] hayato y4bu.net  / 経歴
 *
 * **行き先は引き出しに畳む。** 横に並べると、ページが増えるたびに帯が
 * 混んでいくし、サイトごとに並ぶ数が違うと「同じ帯」に見えない。
 * 帯に出すのは、いまどこにいるかだけにする。
 *
 * 別サイト（blog / slides）は引き出しの中で区切ってから出す。同じ重さで
 * 並べると、押した先でヘッダーの中身が変わる理由が分からなくなる。
 */

const otherSites = SITES.filter((site) => !site.internal)

/** 現在地に出す名前。パスの綴りではなく、ナビと同じ日本語に寄せる */
const LABELS: Record<string, string> = {
  about: "経歴",
  projects: "作品",
  contact: "問い合わせ",
  result: "送信完了",
  licenses: "ライセンス",
  privacy: "cookie",
}

/** uuid は出さない。読めないし、押しても行き先が無い */
const isOpaqueId = (segment: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)

/** URL の都合でしかない段。人に見せる意味が無いので飛ばす */
const SKIP = new Set(["detail"])

/** 実在する行き先。ここに無いものは文字のまま出す（404 に飛ばさない） */
const PAGES = new Set(["/about", "/projects", "/contact", "/licenses", "/privacy"])

/*
 * 現在地。**押して戻れるようにする。**
 *
 * 出すだけだと、作品の詳細から一覧に戻る道がページの中のリンクしか
 * 無くなる。手前の段はすべてリンクにして、いまいる場所だけ文字にする。
 * uuid と detail は段として出さないが、**リンク先を組むときは数える**
 * （/projects/<uuid>/detail の「作品」は /projects を指す）。
 */
const crumbsOf = (pathname: string) => {
  const crumbs: { label: string; href?: string }[] = []
  let href = ""

  for (const segment of pathname.split("/").filter(Boolean)) {
    href += `/${segment}`
    if (isOpaqueId(segment) || SKIP.has(segment)) continue
    crumbs.push({
      label: LABELS[segment] ?? decodeURIComponent(segment),
      href: href !== pathname && PAGES.has(href) ? href : undefined,
    })
  }

  return crumbs
}

const Header = () => {
  const pathname = useCurrentPath()
  const [open, setOpen] = useState(false)

  // Esc で閉じる。開いているときだけ耳を貸す
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  /*
   * 末尾はページから受け取った名前にする。
   * 受け取ったときは、パスから組んだ「押せない段」（= いまいる場所の
   * 生の綴り）を落としてから足す。slug と題が二重に並ばないように。
   */
  const leaf = useCrumbLeaf()
  const crumbs = leaf
    ? [...crumbsOf(pathname).filter((crumb) => crumb.href), { label: leaf, href: undefined }]
    : crumbsOf(pathname)

  const hrefOf = (link: string) => (link === "/" ? "/" : `/${link}`)
  const isActive = (link: string) =>
    link === "/" ? pathname === "/" : pathname.startsWith(`/${link}`)

  return (
    <>
      {/* 空色の帯。スライドの表紙の外周と同じ */}
      <div className="h-1.5 w-full bg-[linear-gradient(90deg,var(--c-band),var(--c-sky),var(--c-band))]" />

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white/90 px-4 py-2.5 backdrop-blur">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="メニューを開く"
          aria-expanded={open}
          className="flex size-8 items-center justify-center border border-line text-ink-2 transition-colors hover:border-sky hover:text-sky-ink"
        >
          <span aria-hidden className="relative block h-[9px] w-4">
            <span className="absolute inset-x-0 top-0 h-px bg-current" />
            <span className="absolute inset-x-0 top-1 h-px bg-current" />
            <span className="absolute inset-x-0 top-2 h-px bg-current" />
          </span>
        </button>

        <Link href="/" className="shrink-0 font-display text-[15px] font-bold tracking-tight text-ink">
          hayato
          <span className="ml-2 font-mono text-[10px] font-normal tracking-widest text-ink-3">
            y4bu.net
          </span>
        </Link>

        <nav
          aria-label="現在地"
          className="flex min-w-0 items-baseline gap-2 font-mono text-[11px] text-ink-3"
        >
          {crumbs.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex min-w-0 items-baseline gap-2">
              <span aria-hidden>/</span>
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="truncate text-ink-2 transition-colors hover:text-sky-ink"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="truncate text-ink-2">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </header>

      {/* 外を押しても閉じる */}
      {open && (
        <button
          type="button"
          aria-label="メニューを閉じる"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/20"
        />
      )}

      {/*
        閉じているときは inert にする。画面の外に出しているだけなので、
        そうしないと Tab で見えないリンクに入ってしまう。
      */}
      <nav
        inert={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col overflow-y-auto border-r border-line bg-white transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-5 pt-6 pb-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-display text-xl font-bold tracking-tight text-ink"
          >
            hayato
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="メニューを閉じる"
            className="ml-auto flex size-9 items-center justify-center font-mono text-[15px] text-ink-3 transition-colors hover:text-sky-ink"
          >
            ✕
          </button>
        </div>

        <ul className="space-y-0.5 px-3">
          {links.map((item) => (
            <li key={item.id}>
              <Link
                href={hrefOf(item.link)}
                onClick={() => setOpen(false)}
                className={`flex items-baseline justify-between gap-3 px-3 py-2 text-[14px] transition-colors ${
                  isActive(item.link)
                    ? "bg-sky-soft font-black text-sky-ink"
                    : "text-ink-2 hover:text-sky-ink"
                }`}
              >
                <span>{item.topic}</span>
                <span className="font-mono text-[10px] tracking-wider text-ink-3">
                  {item.link === "/" ? "/" : `/${item.link}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto border-t border-line px-6 py-5">
          <p className="font-mono text-[10px] tracking-widest text-ink-3">OTHER SITES</p>
          <ul className="mt-2.5 space-y-1.5 font-mono text-[11px] tracking-wider text-ink-3">
            {otherSites.map((site) => (
              <li key={site.label}>
                <a href={site.href} className="transition-colors hover:text-sky-ink">
                  {site.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Header
