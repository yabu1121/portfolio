import Image from "next/image"
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
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      {/* 写真背景（ゆっくりズーム） */}
      <div className="absolute inset-0">
        <Image
          src="/images/heroimage.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ animation: "heroZoom 9s ease-out forwards" }}
        />
      </div>

      {/* 明るい水色オーバーレイ（暗くせず写真の質感を残す） */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/88 via-white/82 to-cyan-50/90" />

      {/* 柔らかい水色のブロブで親しみやすい空気感 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute right-[-5rem] top-1/3 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-[-5rem] left-1/4 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl sm:h-80 sm:w-80" />
      </div>

      {/* 中央コンテンツ */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center sm:py-16">
        {/* キッカー（水色ピル） */}
        <p
          style={{ ...MONO, ...reveal("0.1s") }}
          className="mb-5 rounded-full bg-sky-100 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.3em] text-sky-600 sm:mb-6 sm:px-4 sm:text-[11px] sm:tracking-[0.35em]"
        >
          Backend&nbsp;Engineer
        </p>

        {/* 名前 */}
        <h1
          style={{ ...DISPLAY, ...reveal("0.25s") }}
          className="text-6xl font-light leading-none tracking-tight text-slate-800 sm:text-8xl md:text-[9rem]"
        >
          hayato
        </h1>

        {/* 技術ライン */}
        <p
          style={{ ...MONO, ...reveal("0.5s") }}
          className="mt-6 text-[11px] tracking-[0.2em] text-slate-400 sm:mt-7 sm:text-sm sm:tracking-[0.25em]"
        >
          Go&nbsp;&middot;&nbsp;TypeScript&nbsp;&middot;&nbsp;Next.js
        </p>

        {/* 一言（カジュアル・軽め） */}
        <p
          style={reveal("0.65s")}
          className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500 sm:mt-5 sm:max-w-sm sm:text-base"
        >
          バックエンドが好き。作って、出して、また作る。
        </p>

        {/* ボタン（モバイルは全幅で縦、sm以上は横） */}
        <div
          style={reveal("0.85s")}
          className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:mt-10 sm:w-auto sm:max-w-none sm:flex-row"
        >
          <Link
            href="/about"
            className="rounded-full bg-sky-500 px-8 py-3 text-center text-sm font-medium text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:scale-[1.03] hover:bg-sky-600"
          >
            About Me
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-sky-200 bg-white px-8 py-3 text-center text-sm font-medium text-sky-700 transition-all duration-300 hover:scale-[1.03] hover:border-sky-400 hover:bg-sky-50"
          >
            View Projects
          </Link>
        </div>

        {/* SNS リンク（縦並び・ロゴ＋ユーザー名の踏めるブロック） */}
        <div style={reveal("1s")} className="mt-8 flex w-full max-w-xs flex-col gap-2 sm:mt-11 sm:gap-2.5">
          {snsLinks.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-2 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white hover:shadow-md hover:shadow-sky-100 sm:py-2.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={iconFor(s, "light")}
                  alt=""
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              </span>
              <span className="text-sm font-medium text-slate-700">{s.label}</span>
              <span style={MONO} className="ml-auto truncate text-xs text-slate-400">
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
