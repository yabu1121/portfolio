import ReturnTopButton from "@/app/components/ReturnTopButton"
import Link from "next/link"

import { techs, timeline } from "@/app/utils/data"

const AboutPage = () => {
  return (
    <div className="px-16 py-8 md:px-32 lg:px-48">
      <ReturnTopButton />
      <h1 className="text-2xl text-center underline">About me</h1>
      <div className="mt-4 space-y-2 border">
        <p>学校の授業では C, Java、独学では Next.js を中心に、フロントエンド技術の基礎を学習中です。</p>
        <p>目標はフルスタックエンジニアで、0から1をひとりで製作できるようなエンジニアになることです。</p>
        <p>今後は学習した基礎を用いて作品を作っていこうと思います。</p>
      </div>

      <section className="mt-6">
        <h2 className="mb-2 text-xl">Profile</h2>
        <ul className="pl-5 space-y-1 list-disc">
          <li>興味: フロントエンド、バックエンド</li>
          <li>強み: 忍耐力、分野の開拓</li>
          <li>開発環境: Next.js, TypeScript</li>
        </ul>
      </section>

      <section className="mt-24 mb-24">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-normal text-slate-900">Timeline</h2>
            <p className="mt-1 text-sm font-medium tracking-wider uppercase text-slate-500">これまでの経歴</p>
          </div>
          <div className="py-4 ml-3 space-y-12 border-l-2 border-slate-200 md:ml-6">
            {timeline.map((item) => (
              <div key={item.id} className="relative pl-8 md:pl-12 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-slate-300 group-hover:border-blue-500 transition-colors" />
                
                <div className="flex flex-col gap-4 mb-2 w-80 sm:flex-row items-center justify-between">
                  <div className="">
                    <span className="text-sm font-bold text-blue-700">
                      {item.year}.{item.month}
                    </span>
                    <h3 className="text-lg font-bold mb-4 border-blue-300 transition-all hover:border-b-4 hover:mb-3 text-slate-800 group-hover:text-blue-700">
                      {item.title}
                    </h3>
                  </div>
                  <p className="px-3 py-1 bg-blue-400 text-white rounded mx-4">{item.category}</p>
                </div>
                <p className="leading-relaxed text-glay-300">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

      <section className="mt-6">
        <h2 className="mb-2 text-xl">Skills</h2>
        <div className="space-y-3">
        {techs.map((tech) => (
          <div key={tech.id} className="relative group">
            <div className="flex justify-between text-sm">
              <span tabIndex={0} className="outline-none">{tech.name}</span>
              <span className="text-gray-600">{tech.level}%</span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded">
              <div className="h-2 bg-blue-500 rounded" style={{ width: `${tech.level}%` }} />
            </div>

            <div
              className="absolute z-10 px-3 py-2 mt-2 text-xs text-gray-800 whitespace-pre-line transition scale-95 -translate-x-1/2 translate-y-1 bg-white border rounded-md shadow opacity-0 pointer-events-none left-1/2 top-full group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100"
            >
              {tech.description}
            </div>
          </div>
        ))}
      </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-xl">Links</h2>
        <ul className="pl-5 space-y-1 list-disc">
          <li>
            <a className="text-blue-600 underline" href="https://github.com/yabu1121" target="_blank" rel="noreferrer">GitHub</a>
          </li>
          <li>
            <a className="text-blue-600 underline" href="https://x.com/papox_57" target="_blank" rel="noreferrer">X</a>
          </li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-xl">Contact</h2>
        <Link href="/contact"><p className="text-sm text-gray-700">お気軽にご連絡ください。</p></Link>
      </section>
    </div>
  )
}

export default AboutPage