import Section, { SectionHead } from "./common/Section"
import { listEvents } from "@/lib/about"

const AboutEvent = async () => {
  const data = await listEvents()

  // 年ごとに束ねる。新しい年が下に来る（経歴と同じ並び）
  const byYear = (data ?? []).reduce<Record<string, NonNullable<typeof data>>>((acc, item) => {
    (acc[String(item.year)] ??= []).push(item)
    return acc
  }, {})
  const years = Object.keys(byYear).sort()

  return (
    <Section className="border-t border-line">
      <SectionHead en="Event" title="イベント" note="参加・登壇してきたもの" />

      {/*
        **年でまとめる。** 日付と名前が 2 列にずらりと並んでいるだけだと
        表にしか見えない。年を柱にして、その年に出たものを右に流す。
        罫も引かない（行ごとに線を引くと表に戻る）。
      */}
      {data && (
        <div className="space-y-6">
          {years.map((year) => (
            <section key={year} className="grid gap-x-6 sm:grid-cols-[4rem_1fr]">
              <h3
                style={{ fontFamily: "var(--font-geist-mono)" }}
                className="mb-2 font-mono text-[15px] tabular-nums text-ink-3 sm:mb-0"
              >
                {year}
              </h3>

              {/*
                **段組み（columns）であって grid ではない。** grid の 2 列は
                左・右・左…と行で埋めるので、左の列だけを上から読んでも月が
                飛ぶ。段組みなら上から下に流れてから次の段に移る。
              */}
              <ul className="sm:columns-2 sm:gap-x-8">
                {byYear[year].map((item) => (
                  <li key={item.id} className="flex items-baseline gap-3 break-inside-avoid py-[3px]">
                    {/* 月だけ。年は柱が持っている */}
                    <span className="w-5 shrink-0 font-mono text-[11px] tabular-nums text-ink-3">
                      {String(item.month).padStart(2, "0")}
                    </span>
                    <span className="text-[14px] leading-snug text-ink-2">{item.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

    </Section>
  )
}

export default AboutEvent
