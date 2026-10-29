import Thumbnail from "@/app/components/Thumbnail";
import { TechByKind } from "@/app/components/common/TechByKind";
import CommonButton from "@/app/components/common/CommonButton";
import { sortProjectsForPortfolio } from "@/app/utils/projectOrder";
import { GutterMascots } from "@/app/components/common/GutterMascots";
import { listWorks } from "@/lib/works";

/*
 * 作品一覧。見た目は slides / blog と同じ言語。
 *   方眼紙の地／1px の罫／角は丸めない／アクセントは空色 1 色
 *   技術名とカテゴリは Geist Mono の大文字で、本文と字の扱いを分ける
 *
 * **サーバーで描く。** 以前はブラウザに HTML を返したあと、改めてデータを
 * 取りに行っていた（'use client' + tRPC）。HTML は 0.5 秒で届くのに、中身が
 * 出るまで 3.9 秒かかっていて、その間ずっとローディングだった。
 * ここで引いて埋めれば、届いた時点で中身がある。
 *
 * 引くのも一覧に要るものだけにした。前は使わないメディア一式と各技術の
 * 理解度まで運んでいて 42KB あった。
 */

const ProjectsPage = async () => {
  const orderedWorks = sortProjectsForPortfolio(await listWorks());

  return (
    <div className="paper min-h-screen pb-28">
      <div className="relative mx-auto w-full max-w-5xl px-5 pt-20">
        <GutterMascots
          from="2xl"
          /* 置く数は控えめに。多いほど飾りに見えて、1 羽ごとの効き目が落ちる */
          items={[
            { pose: "guide", side: "left", top: 80, width: 150 },
            { pose: "coding", side: "right", top: 620, width: 120 },
          ]}
        />

        <header className="relative pb-12">
          <h1 className="font-display text-5xl leading-none font-bold tracking-tight text-ink sm:text-6xl">
            Projects
            <span className="mt-3 block text-[0.42em] font-black tracking-wider text-ink-2">
              作品
            </span>
          </h1>
        </header>

        {/*
          2 列。1 枚ずつ縦に積むと 6 件で 3400px になり、下の作品まで
          画面を送り続けることになる。
        */}
        <ul className="grid gap-5 lg:grid-cols-2">
          {orderedWorks.map((project) => (
            <li
              key={project.id}
              className="flex flex-col border border-line bg-white transition-colors hover:border-sky"
            >
              <div className="flex shrink-0 justify-center border-b border-line p-5 pt-7">
                <Thumbnail
                  url={project.thumbnail}
                  altText={project.title}
                  icon={project.miniThumbnail}
                />
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-xl font-black tracking-tight text-ink">
                    {project.title}
                  </h2>
                  <span className="shrink-0 bg-sky-soft px-2 py-0.5 font-mono text-[10px] tracking-wider text-sky-ink">
                    {(project.category || "General").toUpperCase()}
                  </span>
                </div>

                <p className="mt-4 line-clamp-3 text-[14px] leading-relaxed text-ink-2">
                  {project.description}
                </p>

                {/* 使った技術。役割ごとにまとめる。何にどう使ったかは詳細ページ */}
                <div className="mt-auto pt-6">
                  <TechByKind techs={project.techs} />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-line pt-5">
                  <div className="flex flex-wrap gap-2">
                    <CommonButton variant="outline" link={project.githubUrl} text="source" />
                    <CommonButton variant="outline" link={project.lpSiteUrl} text="lp" />
                    <CommonButton variant="outline" link={project.siteUrl} text="site" />
                  </div>
                  <CommonButton link={`/projects/${project.id}/detail`} text="詳細" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectsPage;
