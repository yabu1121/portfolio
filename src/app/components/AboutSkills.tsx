import Image from "next/image";
import Section, { SectionHead } from "./common/Section";
import { isLanguage } from "@/app/utils/techKind";
import { listSkills } from "@/lib/about";

// このセクションで扱うのは言語のみ。
// 言語は「理解度(level)」を縦断的に比較できる単位なのでバー付きで見せる。
// フレームワーク/ライブラリ等は数値化しても情報量が無いため、
// 「どのプロジェクトで何に使ったか」を各プロジェクトの詳細ページ側で語る。
const AboutSkills = async () => {
  // 並びは理解度の高い順（lib/about.ts で付けている）
  const languages = (await listSkills()).filter((s) => isLanguage(s.kind));

  return (
    <Section className="border-t border-line">
      <SectionHead
        en="Skills"
        title="技術"
        note="プロを 100 としたときの自己評価（実装では AI を併用）"
      />

      {languages.length === 0 ? (
        <p className="font-mono text-[11px] text-ink-3">準備中です</p>
      ) : (
        /*
          **箱で囲わない。** 1 つずつ枠で囲って並べると、同じ大きさの札が
          整列しているだけの見た目になる（ページの他の節は罫で区切って
          いるので、ここだけ浮いてもいた）。上に罫を 1 本引いて区切る。
        */
        <div className="grid gap-x-10 sm:grid-cols-2">
          {languages.map((item) => (
            <div key={item.id} className="border-t border-line pt-4 pb-5">
              <div className="flex items-center gap-3">
                <div className="relative size-8 shrink-0">
                  {item.iconUrl ? (
                    <Image src={item.iconUrl} alt={item.name} fill className="object-contain" />
                  ) : (
                    <div className="flex size-full items-center justify-center border border-dashed border-line font-mono text-[8px] text-ink-3">
                      NO
                    </div>
                  )}
                </div>
                <h4 className="font-display text-[15px] font-black text-ink">{item.name}</h4>
                <span className="ml-auto font-mono text-[12px] tabular-nums text-sky-ink">
                  {item.level ?? 0}
                </span>
              </div>

              {/* width ではなく scaleX で伸ばす。width はレイアウトプロパティなので
                  変化のたびに再レイアウトが走るが、transform はコンポジタだけで済む。 */}
              <div className="mt-3 h-[3px] w-full overflow-hidden bg-surface">
                <div
                  className="h-full origin-left bg-sky"
                  style={{ transform: `scaleX(${(item.level ?? 0) / 100})` }}
                />
              </div>

              {item.description && (
                <p className="mt-3 whitespace-pre-line text-[12px] leading-relaxed text-ink-2">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

export default AboutSkills
