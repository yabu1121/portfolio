'use client'
import Thumbnail from "@/app/components/Thumbnail";
import { api } from "@/trpc/client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/app/components/common/Loading";
import Error from "@/app/components/common/Error";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// About This Project の Markdown を Tailwind で整形
const mdComponents: Components = {
  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-8 mb-3" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-8 mb-3 flex items-center gap-2 before:content-[''] before:w-1 before:h-5 before:bg-blue-600 before:rounded-full" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-6 mb-2" {...props} />,
  p: ({ node, ...props }) => <p className="text-gray-700 leading-relaxed my-3" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-3 space-y-1 text-gray-700" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-3 space-y-1 text-gray-700" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
  a: ({ node, ...props }) => <a className="text-blue-600 underline underline-offset-2 hover:text-blue-800" target="_blank" rel="noreferrer" {...props} />,
  code: ({ node, ...props }) => <code className="bg-gray-100 text-pink-600 rounded px-1.5 py-0.5 text-sm font-mono" {...props} />,
  pre: ({ node, ...props }) => <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 my-4 overflow-x-auto text-sm leading-relaxed" {...props} />,
  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-200 pl-4 my-4 text-gray-500 italic" {...props} />,
  table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse text-sm" {...props} /></div>,
  th: ({ node, ...props }) => <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold" {...props} />,
  td: ({ node, ...props }) => <td className="border border-gray-200 px-3 py-2" {...props} />,
};

const ProjectDetail = () => {
  const params = useParams();
  const router = useRouter();
  
  const { data: works, isLoading, error } = api.work.getAll.useQuery();

  if (isLoading) return <Loading />;
  if (error) return <Error error={error}/>;

  const work = works?.find((work) => work.id === params.id);

  if (!work) return <div className="text-center py-20 text-gray-400">Project not found.</div>;

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
      <div>
        <div className="space-y-20">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              About This Project
            </h2>
            <div className="pl-3">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {work.description}
              </ReactMarkdown>
            </div>
          </section>
       
          <section >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Technology Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {work.worksToTechs?.toSorted((a, b) => a.tech.name.localeCompare(b.tech.name))
              .map((item) => (
                <div 
                  key={item.tech.id} 
                  className="flex flex-col md:flex-row  gap-6 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4 md:w-1/2 md:border-r border-gray-100 md:pr-6">
                    <div className="shrink-0 w-20 h-20 relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      {
                      item.tech.iconUrl 
                      ? (
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
        </div>
      </div>
    </main>
  )
}

export default ProjectDetail