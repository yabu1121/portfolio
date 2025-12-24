"use client";

import Image from "next/image"
import Link from "next/link"
import { api } from "@/trpc/client"
import type { RouterOutputs } from "@/trpc/shared"
import LinkButton from "@/app/components/LinkButton";

type WorkWithTechs = RouterOutputs["work"]["getAll"][number];

const ProjectsPage = () => {
  const { data: works, isLoading, error } = api.work.getAll.useQuery();
  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error.message}</div>;

  return (
    <div className="md:px-50 ">
        <h1 className="text-2xl font-bold mb-12 text-center my-20">Projects</h1>
        <div>
          {works?.map((project) => (
            <div key={project.id} className="flex border">
              {project.thumbnail 
              ? (
                <div className="w-full aspect-video">
                  <Image 
                    src={project.thumbnail} 
                    alt={project.title} 
                    width={500}
                    height={500}
                    className="object-cover" 
                  />
                </div>
              )
              : (
                <div>
                  <p className="w-full items-center justify-center aspect-video bg-gray-400/50 text-black flex font-bold text-2xl">
                    No Image
                  </p>
                </div>
              )}

              <div className="p-4 flex flex-col">
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                <ul className="flex flex-wrap gap-2 text-xs mt-6 mb-4">
                  {project.worksToTechs.map((wt) => (
                    <li 
                      key={wt.tech.id} 
                      className="border rounded px-2 py-0.5" 
                    >
                      {wt.tech.name}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-4 text-sm font-medium">
                  <LinkButton url={project.githubUrl} text="この作品のGitHub"/>
                  <LinkButton url={project.lpSiteUrl} text="この作品のLPサイトを見に行く"/>
                  <LinkButton url={project.siteUrl} text="この作品を見に行く"/>
                </div>

              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default ProjectsPage