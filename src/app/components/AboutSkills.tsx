'use client'
import { api } from "@/trpc/client"
import Loading from "./common/Loading";
import Error from "./common/Error";
import Image from "next/image";
import Section from "./common/Section";
import { isLanguage } from "@/app/utils/techKind";

// このセクションで扱うのは言語のみ。
// 言語は「理解度(level)」を縦断的に比較できる単位なのでバー付きで見せる。
// フレームワーク/ライブラリ等は数値化しても情報量が無いため、
// 「どのプロジェクトで何に使ったか」を各プロジェクトの詳細ページ側で語る。
const AboutSkills = () => {
  const { data: skillData, isLoading, error } = api.skill.getAll.useQuery();

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  const languages = (skillData ?? [])
    .filter((s) => isLanguage(s.kind))
    .toSorted((a, b) => (b.level ?? 0) - (a.level ?? 0));

  return (
    <Section className="bg-gray-50/50 rounded-3xl">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Technical Skills</h2>
          <p className="text-gray-500 text-sm">
            プロのエンジニアを100としたときの自己評価です。実装ではAIを併用しています（AIを使わずに書いたものは個別に明記）。
          </p>
        </header>

        {languages.length === 0 ? (
          <p className="text-center text-sm text-slate-400">準備中です</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
              {languages.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 rounded-lg bg-slate-50">
                      {item.iconUrl ? (
                        <Image src={item.iconUrl} alt={item.name} fill className="object-contain p-1.5" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-300">
                          No Image
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                    <span className="ml-auto font-mono text-xs text-slate-400">{item.level ?? 0}</span>
                  </div>

                  {/* width ではなく scaleX で伸ばす。width はレイアウトプロパティなので
                      変化のたびに再レイアウトが走るが、transform はコンポジタだけで済む。 */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full origin-left rounded-full bg-sky-500"
                      style={{ transform: `scaleX(${(item.level ?? 0) / 100})` }}
                    />
                  </div>

                  {item.description && (
                    <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-slate-600">
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
