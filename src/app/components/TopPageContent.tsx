import Link from "next/link"
import { Mascot } from "@/app/components/common/Mascot"
import { GutterMascots } from "@/app/components/common/GutterMascots"
import { visibleSnsLinks, iconFor } from "@/app/utils/snsLinks"
import { links } from "@/app/utils/data"
import { SITES } from "@/app/utils/siteFooter"

/*
 * トップ。写真背景・グラデーション・ぼかしブロブをやめ、方眼紙の地だけにした。
 * 見出しは英数字 Space Grotesk 700 + 和文 Murecho 900、アクセントは空色 1 色。
 * 他のページ（contact / blog / slides）と同じ言語で、左揃えに合わせている。
 *
 * 名前は以前 Fraunces（セリフ）だったが、3 サイトで書体を揃えるため display に寄せた。
 *
 * **置くのは名乗りと行き先だけ。** 記事やスライドの一覧はここには出さない
 * （以前は Feeds で出していた）。トップで中身まで見せると、どこを見れば
 * いいか決まらない画面になる。中身は行った先で見せる。
 */

// CSS のみで段階的リビール（keyframes は globals.css）
const reveal = (delay: string) => ({
  animation: "fadeInUp 0.85s ease-out both",
  animationDelay: delay,
})

/** 小見出し。フッターと同じ言い方にしている */
const Label = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-mono text-[10px] tracking-widest text-ink-3">{children}</h2>
)

const rowClass =
  "group flex items-baseline border border-line bg-white px-4 py-3 transition-[border-color,transform] duration-200 hover:-translate-y-[2px] hover:border-sky"

/*
 * 行き先の列。名前を左、行き先を右に置く。
 * 自サイトのページも外のサイトも同じ形にして、下の SNS とも揃える。
 */
const Row = ({
  href,
  name,
  hint,
  external,
}: {
  href: string
  name: string
  hint: string
  external?: boolean
}) => {
  const body = (
    <>
      <span className="font-display text-[15px] font-bold text-ink group-hover:text-sky-ink">
        {name}
      </span>
      <span className="ml-auto truncate pl-4 font-mono text-[11px] text-ink-3">{hint}</span>
    </>
  )

  return external ? (
    <a href={href} className={rowClass}>
      {body}
    </a>
  ) : (
    <Link href={href} className={rowClass}>
      {body}
    </Link>
  )
}

// トップ自身は行き先に出さない
const pages = links.filter((item) => item.link !== "/")
const otherSites = SITES.filter((site) => !site.internal)

const TopPageContent = () => {
  return (
    <div className="paper min-h-screen">
      <section className="relative mx-auto w-full max-w-4xl px-5 pt-24 pb-24">
        {/* 本文の外側に散らす。xl 未満では出ない */}
        <GutterMascots
          /*
            右上はヒーローのハヤブサが居るので空ける。隣り合うと 2 羽が
            並んで見えて、どちらが主役か分からなくなる。
          */
          /*
            右上はヒーローのハヤブサが居るので空ける（天 155〜297px）。
            下端は地（.paper）の 100vh までに収める。はみ出すとフッターに
            重なる（実測で飛んでいる個体が 1147〜1277px に出てしまっていた）。
          */
          /* 置く数は控えめに。多いほど飾りに見えて、1 羽ごとの効き目が落ちる */
          items={[
            { pose: "coding", side: "left", top: 400, width: 120 },
            { pose: "flying", side: "right", top: 620, width: 130 },
          ]}
        />

        {/*
          左にキャラクター、右に名乗り。
          名乗りの幅は広げない（行が長くなって読みにくい）。
          狭い画面ではキャラクターを上に回す。
        */}
        <header className="relative grid items-center gap-8 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-12">
          <span
            style={reveal("0.1s")}
            className="block w-36 justify-self-center sm:w-full sm:justify-self-start"
          >
            <Mascot pose="wave" width={260} priority className="h-auto w-full" />
          </span>

          <div className="relative max-w-xl">
            <p
              style={reveal("0.1s")}
              className="bg-sky-soft inline-block px-2.5 py-1 font-mono text-[10px] tracking-[0.25em] text-sky-ink"
            >
              BACKEND ENGINEER
            </p>

            <h1
              style={reveal("0.25s")}
              className="mt-5 font-display text-6xl leading-none font-bold tracking-tight text-ink sm:text-7xl"
            >
              hayato
            </h1>

            <p
              style={reveal("0.4s")}
              className="mt-3 font-mono text-[11px] tracking-[0.16em] text-ink-3"
            >
              那須隼人 / HAYATO NASU
            </p>

            <p style={reveal("0.5s")} className="mt-4 font-mono text-[12px] tracking-[0.2em] text-ink-3">
              Go · TypeScript · Next.js
            </p>

            <p style={reveal("0.65s")} className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink-2">
              バックエンドが好き。作って、出して、また作る。
            </p>

          </div>
        </header>

        {/*
          行き先は横に並べる。縦に積むと短い一覧が 3 つ続いて、
          目的のものに行き当たるまで画面を送ることになる。
        */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
        {/* このサイトの中 */}
        <div style={reveal("0.9s")}>
          <Label>PAGES</Label>
          <ul className="mt-3 grid gap-2">
            {pages.map((item) => (
              <li key={item.id}>
                <Row href={`/${item.link}`} name={item.topic} hint={`/${item.link}`} />
              </li>
            ))}
          </ul>
        </div>

        {/* 別のサイト。記事やスライドの中身はあちらで見せる */}
        <div style={reveal("1s")}>
          <Label>SITES</Label>
          <ul className="mt-3 grid gap-2">
            {otherSites.map((site) => (
              <li key={site.label}>
                <Row
                  href={site.href}
                  name={site.label}
                  hint={site.href.replace(/^https:\/\//, "")}
                  external
                />
              </li>
            ))}
          </ul>
        </div>

        {/* 外部リンク。ロゴ・サービス名・ハンドルの 3 列で、ID は等幅 */}
        <div style={reveal("1.1s")} className="sm:col-span-2 lg:col-span-1">
          <Label>ELSEWHERE</Label>
          <ul className="mt-3 grid gap-2">
            {visibleSnsLinks.map((sns) => (
              <li key={sns.href}>
                <a
                  href={sns.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={sns.label}
                  className={rowClass}
                >
                  {/* 外部 CDN の画像なので next/image は通さない */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={iconFor(sns, "light")}
                    alt=""
                    width={16}
                    height={16}
                    loading="lazy"
                    className="mr-3 size-4 shrink-0 self-center"
                  />
                  <span className="font-display text-[15px] font-bold text-ink group-hover:text-sky-ink">
                    {sns.label}
                  </span>
                  <span className="ml-auto truncate pl-4 font-mono text-[11px] text-ink-3">
                    {sns.user}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </section>
    </div>
  )
}

export default TopPageContent
