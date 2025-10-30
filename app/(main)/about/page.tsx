import ReturnTopButton from "@/app/components/ReturnTopButton"
import Link from "next/link"

const AboutPage = () => {

  type Tech = {
    id: number
    name: string
    level: number
    description: string
  }

  type TimelineItem = {
    id: number
    year: string
    month: number
    title: string
    detail: string
  }

  const techs: Tech[] = [
    { id: 1, name: "C", level:  40, description: "基礎、ファイル操作、ポインタ、ソートのアルゴリズム、二分木の探索"},
    { id: 2, name: "C++", level: 30, description: "基礎部分、ソートのアルゴリズム、二分木の探索、DFS"},
    { id: 3, name: "Python", level: 20, description: "Pandas, Numpyに少し触れた程度"},
    { id: 4, name: "Go", level: 10, description: "基本構文を学習中"},
    { id: 5, name: "Java", level: 20, description: "基礎、ファイル操作"},
    { id: 6, name: "Next.js", level: 40, description: "Api操作、データベース接続学習中"},
  ]

  const timeline: TimelineItem[] = [
    { id: 1, year: "2024", month: 4, title: "C", detail: "大学での情報工学コースの講義でc言語を学習開始、基本構文からソートなどのアルゴリズムを学習しています。" },
    { id: 2, year: "2025", month: 8, title: "Next.js", detail: "Udemyを用いて学習中..." },
    { id: 3, year: "2025", month: 10, title: "Java", detail: "大学の講義でJavaを学習中..." },
  ]

  return (
    <div className="px-16 md:px-32 lg:px-48 py-8">
      <ReturnTopButton />
      <h1 className="text-2xl underline text-center">About me</h1>
      <div className="mt-4 space-y-2">
        <p>hayatoです。現在は知識をつけ、インプットをすることをメインに学習をしています。</p>
        <p>学校では C / Java、独学では Next.js を中心に、基礎を学習中です。</p>
        <p>今後は学習した基礎を用いて作品を作っていこうと思います。</p>
      </div>

      <section className="mt-6">
        <h2 className="text-xl mb-2">Profile</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>興味: フロントエンド、バックエンド</li>
          <li>強み: 忍耐力、挑戦的</li>
          <li>開発環境: Next.js, TypeScript</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl mb-2">Timeline</h2>
        <div className="space-y-3">
          {timeline.map((item) => (
            <div key={item.id} className="border rounded p-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm text-gray-600">{item.year}/{item.month}</span>
                </div>
                <span className="font-medium">{item.title}</span>
              </div>
              <p className="mt-1 text-sm text-gray-700">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl mb-2">Skills</h2>
        <div className="space-y-3">
        {techs.map((tech) => (
          <div key={tech.id} className="relative group">
            <div className="flex justify-between text-sm">
              <span tabIndex={0} className="outline-none">{tech.name}</span>
              <span className="text-gray-600">{tech.level}%</span>
            </div>

            <div className="h-2 w-full bg-gray-200 rounded">
              <div className="h-2 bg-blue-500 rounded" style={{ width: `${tech.level}%` }} />
            </div>

            <div
              className="
                pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2
                whitespace-pre-line rounded-md border bg-white px-3 py-2 text-xs text-gray-800 shadow
                opacity-0 translate-y-1 scale-95 transition
                group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100
              "
            >
              {tech.description}
            </div>
          </div>
        ))}
      </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl mb-2">Links</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <a className="text-blue-600 underline" href="https://github.com/yabu1121" target="_blank" rel="noreferrer">GitHub</a>
          </li>
          <li>
            <a className="text-blue-600 underline" href="https://x.com/papox_57" target="_blank" rel="noreferrer">X</a>
          </li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-xl mb-2">Contact</h2>
        <Link href="/contact"><p className="text-sm text-gray-700">お気軽にご連絡ください。</p></Link>
      </section>
    </div>
  )
}

export default AboutPage