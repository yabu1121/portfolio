import Link from "next/link";
import { notFound } from "next/navigation";
import Thumbnail from "@/app/components/Thumbnail";
import { MediaSlideshow } from "@/app/components/common/MediaSlideshow";
import Image from "next/image";
import { isLanguage } from "@/app/utils/techKind";
import { Mascot } from "@/app/components/common/Mascot";
import { LikeButton } from "@/app/components/common/LikeButton"
import { getWork, listWorks } from "@/lib/works"
import { CrumbLeaf } from "@/app/utils/crumb"

/*
 * 作品の詳細。
 *
 * **サーバーで、1 件だけ引く。** 以前は全作品を取ってきて目的の 1 件を
 * 探していた（しかもブラウザから）。中身が出るまで 2 秒かかっていた。
 *
 * **全作品ぶんを先に作っておく。** その場で作ると、冷えた初回に 5.5 秒
 * かかっていた（DB まで往復するため）。件数は数十なので、作っておいても
 * ビルドは重くならない。ここに無い id（あとで足した作品）は、最初の 1 人が
 * 開いたときに作られて以降は使い回される。
 *
 * 作り直しは admin が保存のたびに /api/revalidate を叩いて起こす。
 */
export const generateStaticParams = async () => {
  const works = await listWorks()
  return works.map((work) => ({ id: work.id }))
}

const ProjectDetail = async ({ params }: PageProps<'/projects/[id]/detail'>) => {
  const { id } = await params;
  const work = await getWork(id);
  if (!work) notFound();

  const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

  // 言語は理解度バー付き、それ以外は「何に使ったか」を主役にする
  const languages = work.techs.filter((t) => isLanguage(t.kind)).toSorted(byName);
  const libraries = work.techs.filter((t) => !isLanguage(t.kind)).toSorted(byName);

  return (
    <div className="paper min-h-screen pb-28">
      <main className="mx-auto max-w-6xl px-5 pt-20">
        <Link
          href="/projects"
          className="font-mono text-[11px] tracking-wider text-ink-3 transition-colors hover:text-sky-ink"
        >
          ← 作品一覧
        </Link>

        {/* 帯のパンくずの末尾に作品名を出す。画面には何も出さない */}
        <CrumbLeaf title={work.title} />

        <header className="relative mt-8">
          <h1 className="font-display text-4xl font-black tracking-tight text-ink">{work.title}</h1>
          <div className="mt-4 h-[3px] w-10 bg-sky" />
          <Mascot pose="coding" width={140} className="absolute -top-4 right-0 hidden h-auto w-24 sm:block" />
        </header>

        {/*
          メディアがあればそちらを出す。無ければ表紙 1 枚。
          表紙はメディアに重複して入れない約束なので、両方は出さない。
        */}
        {work.media?.length ? (
          <div className="my-10">
            <MediaSlideshow items={work.media} title={work.title} />
          </div>
        ) : (
          work.thumbnail && (
            <div className="my-10 flex justify-center border border-line bg-white py-8">
              <Thumbnail url={work.thumbnail} altText={work.title} icon={work.miniThumbnail} />
            </div>
          )
        )}

      <div className="space-y-16">
        <section>
          <h2 className="mb-4 flex items-center gap-3 font-display text-xl font-black text-ink">
            <span className="h-5 w-[3px] bg-sky" />
            About This Project
          </h2>
          <p className="pl-4 text-[14px] leading-relaxed whitespace-pre-wrap text-ink-2">
            {work.description}
          </p>
        </section>

        {languages.length > 0 && (
          <section>
            <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-black text-ink">
              <span className="h-5 w-[3px] bg-sky" />
              言語
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {languages.map((item) => {
                const level = item.level ?? null;
                return (
                  <div
                    key={item.id}
                    className="border border-line bg-white p-5 transition-colors hover:border-sky"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative size-12 shrink-0 overflow-hidden border border-line bg-white">
                        {item.iconUrl ? (
                          <Image
                            src={item.iconUrl}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center font-mono text-[9px] text-ink-3">NO IMAGE</div>
                        )}
                      </div>
                      <h3 className="font-display text-[16px] font-black text-ink">{item.name}</h3>
                      {level !== null && (
                        <span className="ml-auto font-mono text-[11px] tabular-nums text-sky-ink">理解度 {level}</span>
                      )}
                    </div>

                    {level !== null && (
                      <div className="mt-4 h-[3px] w-full overflow-hidden bg-surface">
                        <div
                          className="h-full bg-sky"
                          style={{ width: `${level}%` }}
                        />
                      </div>
                    )}

                    <div className="mt-5">
                      <h4 className="mb-1.5 font-mono text-[10px] tracking-wider text-ink-3">このプロジェクトでの役割</h4>
                      <p className="text-[13px] leading-relaxed text-ink-2">
                        {item.description || "この技術を使用して構築されました。"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {libraries.length > 0 && (
          <section>
            <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-black text-ink">
              <span className="h-5 w-[3px] bg-sky" />
              使用ライブラリ・ツール
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {libraries.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 border border-line bg-white p-5 transition-colors hover:border-sky md:flex-row"
                >
                  <div className="flex items-center gap-4 md:w-1/2 md:border-r md:border-line md:pr-5">
                    <div className="relative size-16 shrink-0 overflow-hidden border border-line bg-white">
                      {item.iconUrl ? (
                        <Image
                          src={item.iconUrl}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center font-mono text-[9px] text-ink-3">NO IMAGE</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-[16px] font-black text-ink">{item.name}</h3>
                      {item.about && (
                        <p className="mt-1 text-[12px] leading-snug text-ink-3">
                          {item.about}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="md:w-1/2 flex flex-col justify-center">
                    <h4 className="mb-2 font-mono text-[10px] tracking-wider text-ink-3">使用理由</h4>
                    <p className="text-[13px] leading-relaxed text-ink-2">
                      {item.description || "この技術を使用して構築されました。"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 読み終わり。押せるのはここ 1 つだけ */}
        <div className="mt-16 border-t border-line pt-8">
          <LikeButton kind="work" target={work.id} />
        </div>
        </div>
      </main>
    </div>
  )
}

export default ProjectDetail
