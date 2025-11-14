import Image from "next/image"
import Link from "next/link"

const ProjectsPage = () => {

  type Project = {
    id: number
    title: string
    description: string
    techs: string[]
    github?: string
    url?: string
    image?: string
    category: "ai" | "udemy" | "self"
  }

  const projects: Project[] = [
    {
      id: 1,
      title: "Portfolio",
      description: "Next.js と Tailwind CSS で作成した個人ポートフォリオサイト。",
      techs: ["Next.js", "Tailwind CSS", "TypeScript"],
      github: "https://github.com/yabu1121/portfilio",
      url: "/",
      image: "/images/portfolioProject.png",
      category: "self",
    },
    {
      id: 2,
      title: "Todo App",
      description: "シンプルなタスク管理。状態管理とアクセシビリティを意識したUI。",
      techs: ["React", "TypeScript"],
      github: "#",
      url: "#",
      image: "/images/todoProject.png",
      category: "udemy",
    },
    {
      id: 3,
      title: "Order System",
      description: "カフェのオーダーシステムを簡易的に作成、レシートを印刷できる。",
      techs: ["Next.js"],
      github: "https://github.com/yabu1121/order-system.git",
      url: "https://order-system-pink.vercel.app/",
      image: "/images/orderSystemProject.png",
      category: "self",
    },
    {
      id: 4,
      title: "old portfolio",
      description: "昔のポートフォリオサイト、",
      techs: ["React.js"],
      github: "https://github.com/yabu1121/PortfolioSite.git",
      url: "https://portfolio-site-delta-two.vercel.app/",
      image: "/images/noImage.jpg",
      category: "self",
    },
    {
      id: 5,
      title: "blog",
      description: "database連携をしたblogアプリ",
      techs: ["Next.js", "Tailwind CSS", "Supabase"],
      github: "https://github.com/yabu1121/blog-app.git",
      url: "https://blog-app-pu5r.vercel.app/",
      image: "/images/blog.png",
      category: "udemy",
    },
    {
      id: 6,
      title: "calculator",
      description: "簡単な計算機",
      techs: ["Next.js"],
      github: "https://github.com/yabu1121/calculator.git",
      url: "https://calculator-smoky-phi-btvo8k36hd.vercel.app/",
      image: "/images/calculator.png",
      category: "self",
    },
    {
      id: 7,
      title: "ecサイト風アプリ",
      description: "今後は実際に機能を増やしていきます。",
      techs: ["Next.js","Tailwind css", "supabase"],
      github: "https://github.com/yabu1121/market",
      url: "https://market-pied-seven.vercel.app/",
      image: "/images/market.png",
      category: "self",
    }
  ]

  const renderList = (items: Project[]) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((project) => (
        <div key={project.id} className="border rounded">
          {project.image && (
            <div className="relative w-full aspect-video">
              <Image src={project.image} alt={project.title} fill className="object-cover" />
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