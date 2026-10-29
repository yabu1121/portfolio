import Link from "next/link"
import { visibleSnsLinks, iconFor } from "@/app/utils/snsLinks"
import { SITES, FONTS, OFL_URL, COPYRIGHT_YEAR } from "@/app/utils/siteFooter"

/*
 * ページ末尾のフッター。blog / slides と同じ並びにしている。
 *
 * 置いているもの:
 *   - 3 サイトの行き先（www / blog / slides）
 *   - 外部リンク（visibleSnsLinks。増減は snsLinks.ts を 1 行直すだけ）
 *   - 書体の表示。自前配布している woff2 は全部 SIL OFL 1.1 なので、
 *     名前とライセンスを出す。**これは義理ではなく条件**（OFL 2 項）。
 *     ライセンス本文の同梱は /licenses で受ける。
 *
 * 下の余白が深いのは、狭い画面では Footer.tsx（固定のボトムナビ）が
 * かぶるため。md 以上ではナビが消えるので詰める。
 */

const Label = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-mono text-[10px] tracking-widest text-ink-3">{children}</h2>
)

const SiteFooter = () => (
  <footer className="mt-24 border-t border-line">
    <div className="mx-auto max-w-5xl px-5 pt-12 pb-24 md:pb-12">
      <div className="grid gap-10 sm:grid-cols-[1fr_auto_auto] sm:gap-14">
        {/* 誰の場所なのか。ここだけ字を大きくする */}
        <div className="max-w-xs">
          <p className="font-display text-xl font-bold tracking-tight">y4bu.net</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
            作ったもの・書いたもの・話したものの置き場です。
          </p>
        </div>

        <nav>
          <Label>SITES</Label>
          <ul className="mt-3 grid gap-2">
            {SITES.map((site) => (
              <li key={site.label}>
                {/* 同じドメイン内（www）は Link、他サイトは素の a */}
                {site.internal ? (
                  <Link href={site.href} className="text-[13px] hover:text-sky-ink">
                    {site.label}
                  </Link>
                ) : (
                  <a href={site.href} className="text-[13px] hover:text-sky-ink">
                    {site.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <nav>
          <Label>ELSEWHERE</Label>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
            {visibleSnsLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noreferrer"
                  className="group flex items-center gap-2 text-[13px] hover:text-sky-ink"
                >
                  {/* simpleicons は SVG を返す。next/image の最適化は SVG を通せないので素の img。
                      13px の飾りなので LCP には関わらない */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={iconFor(link, "light")}
                    alt=""
                    width={13}
                    height={13}
                    loading="lazy"
                    className="size-[13px] opacity-45 transition-opacity group-hover:opacity-100"
                  />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-12 flex flex-col gap-2 border-t border-line pt-5 font-mono text-[10px] leading-relaxed tracking-wide text-ink-3 sm:flex-row sm:items-baseline sm:justify-between">
        <p>© {COPYRIGHT_YEAR} hayato</p>
        <p>
          Fonts: {FONTS.join(" / ")} —{" "}
          <a href={OFL_URL} target="_blank" rel="noreferrer" className="underline hover:text-sky-ink">
            SIL Open Font License 1.1
          </a>
          {" · "}
          <Link href="/licenses" className="underline hover:text-sky-ink">
            ライセンス
          </Link>
          {" · "}
          <Link href="/privacy" className="underline hover:text-sky-ink">
            cookie
          </Link>
        </p>
      </div>
    </div>
  </footer>
)

export default SiteFooter
