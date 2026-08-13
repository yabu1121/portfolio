import React from 'react'

// /about の各セクション共通のコンテナ。
// 幅・左右パディングをここで一元管理しているので、
// ページ全体の横幅を変えたいときは下の max-w-4xl だけを触ればよい。
// 背景色と角丸はセクションごとに違うため className で受け取る
// （基底クラスに置くと Tailwind の同種クラスが衝突して出力順で勝敗が決まってしまう）。

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const Section = ({ children, className = '' }: SectionProps) => {
  return (
    <section className={`mx-auto max-w-4xl px-5 py-6 sm:px-8 sm:py-8 ${className}`}>
      {children}
    </section>
  )
}

export default Section
