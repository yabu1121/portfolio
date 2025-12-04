
import Image from "next/image"
import Link from "next/link"

import { projects } from "@/app/utils/data"
import { Project } from "@/app/utils/type"
import FadeInSection from "@/app/components/FadeInSection"

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
      <FadeInSection animation="fadeInDown">
        <h1 className="text-2xl mb-2 text-center">Projects</h1>
      </FadeInSection>

      <FadeInSection className="mt-24" animation="fadeInLeft">
        <section>
          <h2 className="text-xl mb-12">Self</h2>
          {renderList(projects.filter((project) => project.category === "self"))}
        </section>
      </FadeInSection>

      <FadeInSection className="mt-24" animation="fadeInRight">
        <section>
          <h2 className="text-xl mb-12">use AI</h2>
          {renderList(projects.filter((project) => project.category === "ai"))}
        </section>
      </FadeInSection>

      <FadeInSection className="mt-24" animation="fadeInScale">
        <section>
          <h2 className="text-xl mb-12">use Udemy</h2>
          {renderList(projects.filter((project) => project.category === "udemy"))}
        </section>
      </FadeInSection>
    </div>
  )
}

export default ProjectsPage