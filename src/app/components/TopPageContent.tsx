'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

const MONO = { fontFamily: "var(--font-geist-mono)" }
const DISPLAY = { fontFamily: "var(--font-fraunces)" }

const TopPageContent = () => {
  const [v, setV] = useState(false)
  useEffect(() => setV(true), [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* 背景写真：読み込み後にゆっくりズームして生命感を出す */}
      <div className="absolute inset-0">
        <Image
          src="/images/heroimage.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-transform duration-[7000ms] ease-out ${v ? "scale-110" : "scale-100"}`}
        />
      </div>

      {/* シネマ的グラデ＋ヴィネットで奥行きと可読性 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(115% 85% at 50% 42%, transparent 42%, rgba(0,0,0,0.6) 100%)" }}
      />

      {/* 中央コンテンツ */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* キッカー（mono） */}
        <p
          style={MONO}
          className={`mb-6 text-[11px] uppercase tracking-[0.45em] text-emerald-300/90 transition-all duration-700 ${v ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
        >
          Backend&nbsp;Engineer
        </p>

        {/* 名前（セリフ体） */}
        <h1
          style={DISPLAY}
          className={`text-7xl font-light leading-none tracking-tight text-white transition-all delay-150 duration-1000 sm:text-8xl md:text-[9rem] ${v ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          hayato
        </h1>

        {/* 技術ライン（mono） */}
        <p
          style={MONO}
          className={`mt-7 text-xs tracking-[0.25em] text-white/70 transition-all delay-500 duration-1000 sm:text-sm ${v ? "opacity-100" : "opacity-0"}`}
        >
          Go&nbsp;&middot;&nbsp;TypeScript&nbsp;&middot;&nbsp;Next.js
        </p>

        {/* 一言（実像を反映） */}
        <p
          className={`mt-5 max-w-sm text-sm leading-relaxed text-white/65 transition-all delay-[700ms] duration-1000 sm:text-base ${v ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
        >
          計測して数値で語る。設計は自分で、実装はAIと。
        </p>

        {/* ボタン */}
        <div
          className={`mt-12 flex flex-col gap-4 transition-all delay-[900ms] duration-1000 sm:flex-row ${v ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          <Link
            href="/about"
            className="rounded-full bg-white/95 px-9 py-3.5 text-sm font-medium text-black backdrop-blur transition-all duration-300 hover:scale-[1.03] hover:bg-white"
          >
            About Me
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-white/40 bg-white/5 px-9 py-3.5 text-sm font-medium text-white backdrop-blur transition-all duration-300 hover:scale-[1.03] hover:border-white/70 hover:bg-white/15"
          >
            View Projects
          </Link>
        </div>
      </div>

      {/* 細いフレーム（余白の効いた装飾） */}
      <div className="pointer-events-none absolute inset-3 z-10 rounded-sm border border-white/10 sm:inset-5" />
    </section>
  )
}

export default TopPageContent
