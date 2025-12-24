"use client";

import Image from "next/image"
import Link from "next/link"
import { api } from "@/trpc/client"
import type { RouterOutputs } from "@/trpc/shared"

type WorkWithTechs = RouterOutputs["work"]["getAll"][number];

const ProjectsPage = () => {
  const { data: works, isLoading, error } = api.work.getAll.useQuery();
  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error.message}</div>;

  return (
    <div className="px-6 md:px-10 lg:px-16 py-8">
        <h1 className="text-2xl mb-12 text-center">Projects</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works?.map((project) => (
            <div key={project.id} className="border rounded-lg overflow-hidden flex flex-col">
              {project.thumbnail && (
                <div className="relative w-full aspect-video">
                  <Image 
                    src={project.thumbnail} 
                    alt={project.title} 
                    fill 
                    className="object-cover" 
                  />
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
                      style={{ borderColor: wt.tech.color ?? "#ddd" }}
                    >
                      {wt.tech.name}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-4 text-sm font-medium">
                  {project.githubUrl && (
                    <Link className="text-blue-600 hover:underline" href={project.githubUrl} target="_blank" rel="noreferrer">
                      この作品のGitHub
                    </Link>
                  )}
                  {project.lpSiteUrl 
                  ? (
                    <Link className="text-blue-600 hover:underline" href={project.lpSiteUrl} target="_blank" rel="noreferrer">
                      この作品のLPサイトを見に行く
                    </Link>
                  )
                
                  : (
                    <p className="text-gray-900/70">
                      この作品のLPサイトを見に行く
                    </p>
                  )}
                  {project.siteUrl && (
                    <Link className="text-blue-600 hover:underline" href={project.siteUrl} target="_blank" rel="noreferrer">
                      この作品を見に行く
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default ProjectsPage