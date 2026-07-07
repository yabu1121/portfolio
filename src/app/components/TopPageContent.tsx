import Link from "next/link"
import { snsLinks, iconFor } from "@/app/utils/snsLinks"

const MONO = { fontFamily: "var(--font-geist-mono)" }
const DISPLAY = { fontFamily: "var(--font-fraunces)" }

// CSS のみで段階的リビール
const reveal = (delay: string) => ({
  animation: "fadeInUp 0.85s ease-out both",
  animationDelay: delay,
})

const TopPageContent = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      {/* 柔らかい水色のブロブで親しみやすい空気感 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute right-[-6rem] top-1/3 h-96 w-96 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/4 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      </div>

      {/* 中央コンテンツ */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* キッカー（水色ピル） */}
        <p
          style={{ ...MONO, ...reveal("0.1s") }}
          className="mb-6 rounded-full bg-sky-100 px-4 py-1.5 text-[11px] uppercase tracking-[0.35em] text-sky-600"
        >
          Backend&nbsp;Engineer
        </p>

        {/* 名前 */}
        <h1
          style={{ ...DISPLAY, ...reveal("0.25s") }}
          className="text-7xl font-light leading-none tracking-tight text-slate-800 sm:text-8xl md:text-[9rem]"
        >
          hayato
        </h1>

        {/* 技術ライン */}
        <p
          style={{ ...MONO, ...reveal("0.5s") }}
          className="mt-7 text-xs tracking-[0.25em] text-slate-400 sm:text-sm"
        >
          Go&nbsp;&middot;&nbsp;TypeScript&nbsp;&middot;&nbsp;Next.js
        </p>

        {/* 一言（カジュアル・軽め） */}
        <p
          style={reveal("0.65s")}
          className="mt-5 max-w-sm text-sm leading-relaxed text-slate-500 sm:text-base"
        >
          バックエンドが好き。作って、出して、また作る。
        </p>

        {/* ボタン */}
        <div style={reveal("0.85s")} className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/about"
            className="rounded-full bg-sky-500 px-9 py-3.5 text-sm font-medium text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.03] hover:bg-sky-600"
          >
            About Me
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-sky-200 bg-white px-9 py-3.5 text-sm font-medium text-sky-700 transition-all duration-300 hover:scale-[1.03] hover:border-sky-400 hover:bg-sky-50"
          >
            View Projects
          </Link>
        </div>

        {/* SNS リンク（ロゴ＋ユーザー名の踏めるブロック） */}
        <div style={reveal("1s")} className="mt-11 flex max-w-2xl flex-wrap items-center justify-center gap-3">
          {snsLinks.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="group flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/80 py-2 pl-2 pr-4 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white hover:shadow-sm"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconFor(s, "light")}
                  alt=""
                  width={15}
                  height={15}
                  className="h-[15px] w-[15px]"
                />
              </span>
              <span style={MONO} className="text-xs text-slate-600 sm:text-sm">
                {s.user}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopPageContent
