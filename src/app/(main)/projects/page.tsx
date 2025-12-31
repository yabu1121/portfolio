"use client";

import { api } from "@/trpc/client";
import Thumbnail from "@/app/components/Thumbnail";
import MiniThumbnail from "@/app/components/MiniThumbnail";
import CommonButton from "@/app/components/common/CommonButton";

const ProjectsPage = () => {
  const { data: works, isLoading, error } = api.work.getAll.useQuery();
  if (isLoading) return <div className="text-center py-20 animate-pulse">Loading Projects...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-16 text-center text-gray-800">Projects</h1>
      <div className="flex flex-col gap-8">
        {works?.map((project) => (
          <div key={project.id} className="flex flex-col md:flex-row md:border md:border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300" >
            <div className="bg-gray-50 p-6 flex flex-col items-center gap-4 md:border-r-2 md:border-dashed md:border-gray-400">
              <Thumbnail url={project.thumbnail} altText={project.title} />
            </div>

            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-2xl text-gray-900">{project.title}</h3>
                <span className="text-xs font-semibold px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full">
                  {project.category || "General"}
                </span>
              {project.miniThumbnail && (
                <div className="flex items-center gap-2 self-start mt-2">
                  <MiniThumbnail url={project.miniThumbnail} altText={project.title} />
                </div>
              )}
              </div>
              
              <p className="text-gray-600 mt-4 leading-relaxed line-clamp-3">
                {project.description}
              </p>

              <ul className="flex flex-wrap gap-2 mt-auto pt-6 mb-6">
                {project.worksToTechs.map((wt : any) => (
                  <li 
                    key={wt.tech.id} 
                    className="bg-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-wider rounded px-2.5 py-1 border border-gray-200" 
                  >
                    {wt.tech.name}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-gray-100 pt-4">
                <div className="flex gap-4">
                  <CommonButton className={`${!project.githubUrl ? "bg-gray-700/40 hover:bg-gray-700/40 cursor-default": "bg-blue-500"}`} link={project.githubUrl} text="view source code" />
                  <CommonButton className={`${!project.lpSiteUrl ? "bg-gray-700/40 hover:bg-gray-700/40 cursor-default": "bg-blue-500"}`} link={project.lpSiteUrl} text="view lp site" />
                  <CommonButton className={`${!project.siteUrl ? "bg-gray-700/40 hover:bg-gray-700/40 cursor-default": "bg-blue-500"}`} link={project.siteUrl} text="view site" />
                </div>
                <CommonButton link={`/projects/${project.id}/detail`} text="詳細"/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;