import Image from "next/image"
import Link from "next/link"

const MONO = { fontFamily: "var(--font-geist-mono)" }
const DISPLAY = { fontFamily: "var(--font-fraunces)" }

// CSS のみで段階的リビール（stateを使わない）
const reveal = (delay: string) => ({
  animation: "fadeInUp 0.85s ease-out both",
  animationDelay: delay,
})

const TopPageContent = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* 背景写真：ゆっくりズームして生命感を出す */}
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
          style={{ ...MONO, ...reveal("0.1s") }}
          className="mb-6 text-[11px] uppercase tracking-[0.45em] text-emerald-300/90"
        >
          Backend&nbsp;Engineer
        </p>

        {/* 名前（セリフ体） */}
        <h1
          style={{ ...DISPLAY, ...reveal("0.25s") }}
          className="text-7xl font-light leading-none tracking-tight text-white sm:text-8xl md:text-[9rem]"
        >
          hayato
        </h1>

        {/* 技術ライン（mono） */}
        <p
          style={{ ...MONO, ...reveal("0.5s") }}
          className="mt-7 text-xs tracking-[0.25em] text-white/70 sm:text-sm"
        >
          Go&nbsp;&middot;&nbsp;TypeScript&nbsp;&middot;&nbsp;Next.js
        </p>

        {/* 一言（実像を反映） */}
        <p
          style={reveal("0.65s")}
          className="mt-5 max-w-sm text-sm leading-relaxed text-white/65 sm:text-base"
        >
          計測して数値で語る。設計は自分で、実装はAIと。
        </p>

        {/* ボタン */}
        <div style={reveal("0.85s")} className="mt-12 flex flex-col gap-4 sm:flex-row">
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
