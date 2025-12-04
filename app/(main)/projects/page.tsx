import Image from "next/image"
import Link from "next/link"

import { projects } from "@/app/utils/data"
const ProjectsPage = () => {
  const renderList = (items: Project[]) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((project) => (
        <div key={project.id} className="border rounded">
          {project.image && (
            <div className="relative w-full aspect-video">
              <Image src={project.image} alt={project.title} fill />
            </div>
          )}
          <div className="p-3">
            <h3 className="font-semibold text-base">{project.title}</h3>
            <p className="text-sm mt-4">{project.description}</p>
            <ul className="flex flex-wrap gap-2 text-xs mt-8">
              {project.techs.map((tech) => (
                <li key={tech} className="border rounded px-2 py-0.5">{tech}</li>
              ))}
            </ul>
            <div className="flex gap-3 text-sm mb-4">
              {project.github && (
                <Link className="underline" href={project.github} target="_blank" rel="noreferrer">GitHub</Link>
              )}
              {project.url && (
                <Link className="underline" href={project.url} target="_blank" rel="noreferrer">View</Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
  return (
    <div className="px-6 md:px-10 lg:px-16 py-8">
      <h1 className="text-2xl underline text-center">Projects</h1>
      
      <section className="mt-24">
        <h2 className="text-xl mb-12">Self</h2>
        {renderList(projects.filter((project) => project.category === "self"))}
      </section>

      <section className="mt-24">
        <h2 className="text-xl mb-12">use AI</h2>
        {renderList(projects.filter((project) => project.category === "ai"))}
      </section>

      <section className="mt-24">
        <h2 className="text-xl mb-12">use Udemy</h2>
        {renderList(projects.filter((project) => project.category === "udemy"))}
      </section>

    </div>
  )
}

export default ProjectsPage