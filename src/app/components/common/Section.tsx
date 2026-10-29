import React from 'react'

/*
 * /about の各セクション共通のコンテナ。
 * 幅と左右パディングをここで一元管理している。
 *
 * 背景と枠はセクションごとに違うため className で受け取る
 * （基底クラスに置くと Tailwind の同種クラスが衝突して出力順で勝敗が決まる）。
 */

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const Section = ({ children, className = '' }: SectionProps) => {
  return (
    <section className={`mx-auto max-w-4xl px-5 py-7 sm:px-8 ${className}`}>
      {children}
    </section>
  )
}

/*
 * セクションの見出し。
 *
 * **日本語を主、英字は小さく添える。** 英語の大見出し + 小さな和文 +
 * 短い色付きの下線、を 4 つ並べると、どれも同じ型に見えて作り物めいて
 * くる。見出しは節の始まりが分かれば足りるので、下線のかわりに罫を
 * 右へ伸ばす。
 *
 * **マスコットは置かない。** 節ごとに同じ位置・同じ大きさで出ていて、
 * これも型の一部になっていた。余白（GutterMascots）のぶんで足りる。
 */
export const SectionHead = ({
  title,
  en,
  note,
}: {
  title: string;
  /** 見出しの上に小さく置く英字。無くてもよい */
  en?: string;
  note?: string;
}) => (
  <header className="mb-7">
    <div className="flex items-end gap-4">
      <div className="min-w-0">
        {en && (
          <p className="font-mono text-[10px] tracking-[0.2em] text-ink-3">{en.toUpperCase()}</p>
        )}
        <h2 className="mt-1 font-display text-xl font-black tracking-tight text-ink sm:text-[22px]">
          {title}
        </h2>
      </div>

      {/* 節の区切りの線。見出しの高さに合わせて右へ伸ばす */}
      <span aria-hidden className="mb-2 h-px flex-1 bg-line" />
    </div>

    {note && <p className="mt-2.5 text-[12px] text-ink-3">{note}</p>}
  </header>
)

export default Section
