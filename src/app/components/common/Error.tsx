'use client'

import Image from 'next/image'

interface ErrorProps {
  error?: {
    message?: string;
  } | null;
}

const Error = ({ error }: ErrorProps) => {
  const errorMessage = error?.message || "予期せぬエラーが発生しました。";

  return (
    <div className="paper flex min-h-dvh items-center justify-center px-5">
      <div className="w-full max-w-md border border-line bg-white p-7">
        <Image src="/mascot/pose-thinking.webp" alt="" width={96} height={96} className="mb-4 size-24" />

        <p className="font-mono text-[11px] tracking-widest text-[#b91c1c]">ERROR</p>

        <h2 className="mt-3 font-display text-xl font-black tracking-tight text-ink">
          読み込めませんでした
        </h2>

        {/* サーバの文面はそのまま出す。原因が分からないと直せない */}
        <p className="mt-3 font-mono text-[12px] leading-relaxed break-words text-ink-2">
          {errorMessage}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-7 border border-line bg-white px-4 py-2 font-mono text-[11px] tracking-wider text-ink-2 transition-colors hover:border-sky hover:text-sky-ink"
        >
          再読み込み
        </button>
      </div>
    </div>
  )
}

export default Error
