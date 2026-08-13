'use client'
import Thumbnail from "@/app/components/Thumbnail";
import { api } from "@/trpc/client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/app/components/common/Loading";
import Error from "@/app/components/common/Error";
import { isLanguage } from "@/app/utils/techKind";

const ProjectDetail = () => {
  const params = useParams();
  const router = useRouter();

  const { data: works, isLoading, error } = api.work.getAll.useQuery();

  if (isLoading) return <Loading />;
  if (error) return <Error error={error}/>;

  const work = works?.find((work) => work.id === params.id);

  if (!work) return <div className="text-center py-20 text-gray-400">Project not found.</div>;

  const byName = (a: { tech: { name: string } }, b: { tech: { name: string } }) =>
    a.tech.name.localeCompare(b.tech.name);

  const usedTechs = work.worksToTechs ?? [];
  // 言語は理解度バー付き、それ以外は「何に使ったか」を主役にする
  const languages = usedTechs.filter((t) => isLanguage(t.tech.kind)).toSorted(byName);
  const libraries = usedTechs.filter((t) => !isLanguage(t.tech.kind)).toSorted(byName);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <button onClick={() => router.push('/projects')} className="cursor-pointer mb-8 text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-2">
        ← Back to Projects
      </button>

      <section>
        <h1 className="text-4xl font-black text-gray-900 mb-6">{work.title}</h1>
        <div className="rounded-2xl bg-white my-10 py-8 flex justify-center">
          {work.thumbnail && <Thumbnail url={work.thumbnail} altText={work.title} />}
        </div>
      </section>

      <div className="space-y-20">
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            About This Project
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-3">
            {work.description}
          </p>
        </section>

        {languages.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              言語
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {languages.map((item) => {
                const level = item.tech.myTechs?.[0]?.level ?? null;
                return (
                  <div
                    key={item.tech.id}
                    className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-14 h-14 relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        {item.tech.iconUrl ? (
                          <Image
                            src={item.tech.iconUrl}
                            alt={item.tech.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">{item.tech.name}</h3>
                      {level !== null && (
                        <span className="ml-auto font-mono text-xs text-gray-400">理解度 {level}</span>
                      )}
                    </div>

                    {level !== null && (
                      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-sky-500 transition-all duration-1000"
                          style={{ width: `${level}%` }}
                        />
                      </div>
                    )}

                    <div className="mt-5">
                      <h4 className="text-sm tracking-wider text-gray-500 mb-1">このプロジェクトでの役割</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
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
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              使用ライブラリ・ツール
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {libraries.map((item) => (
                <div
                  key={item.tech.id}
                  className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4 md:w-1/2 md:border-r border-gray-100 md:pr-6">
                    <div className="shrink-0 w-20 h-20 relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      {item.tech.iconUrl ? (
                        <Image
                          src={item.tech.iconUrl}
                          alt={item.tech.name}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{item.tech.name}</h3>
                      <p className="text-sm text-gray-500 leading-snug mt-1">
                        {item.tech.description}
                      </p>
                    </div>
                  </div>

                  <div className="md:w-1/2 flex flex-col justify-center">
                    <h4 className="text-lg tracking-wider mb-2">使用理由</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {item.description || "この技術を使用して構築されました。"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default ProjectDetail
