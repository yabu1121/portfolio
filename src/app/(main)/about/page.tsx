import Aboutme from "@/app/components/Aboutme"
import AboutTimeline from "@/app/components/AboutTimeline"
import AboutSkills from "@/app/components/AboutSkills"
import AboutEvent from "@/app/components/AboutEvent"
import { GutterMascots } from "@/app/components/common/GutterMascots"

const AboutPage = () => {
  return (
    <div className="paper relative min-h-screen pb-28">
      {/* 本文の外側。セクションの区切りあたりに置く */}
      <div className="relative mx-auto max-w-4xl">
        <GutterMascots
          /*
            ここは節ごとの見出しから 4 羽外したぶん、余白側はそのまま残す
            （ページが長いので、間が空きすぎると居なくなったように見える）。
          */
          items={[
            { pose: "flying", side: "right", top: 100, width: 120 },
            { pose: "guide", side: "left", top: 560, width: 130 },
            { pose: "thinking", side: "right", top: 1100, width: 120 },
            { pose: "celebrate", side: "left", top: 1700, width: 120 },
          ]}
        />
      </div>

      {/* ページの表題。各セクションの見出しより 1 段大きく出す */}
      <header className="mx-auto max-w-4xl px-5 pt-20 pb-10 sm:px-8">
        <h1 className="font-display text-5xl leading-none font-bold tracking-tight text-ink sm:text-6xl">
          About
          <span className="mt-3 block text-[0.42em] font-black tracking-wider text-ink-2">
            経歴とスキル
          </span>
        </h1>
      </header>

      {/*
        **紙は 1 枚。** 節ごとに白い札を置くと、同じ箱が 4 つ縦に並ぶだけの
        見た目になる。1 枚の紙に罫で区切って載せる。
      */}
      <div className="mx-auto max-w-4xl border border-line bg-white">
        <Aboutme />
        <AboutTimeline />
        <AboutEvent />
        <AboutSkills />
      </div>
    </div>
  )
}

export default AboutPage
