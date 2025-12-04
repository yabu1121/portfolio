import ReturnTopButton from "@/app/components/ReturnTopButton"
import Link from "next/link"

import { techs, timeline } from "@/app/utils/data"
import Image from "next/image"
import FadeInSection from "@/app/components/FadeInSection"

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeInSection className="mt-12 mb-12 sm:mt-24 sm:mb-24 lg:mt-40 lg:mb-40" animation="fadeInUp">
        <div className="px-5 sm:px-8 py-6 sm:py-8 rounded bg-white">
          <h1 className="mb-2 text-2xl">About me</h1>
          <div className="mt-4 space-y-2 px-3 py-3 text-sm sm:text-base leading-relaxed">
            <p>学校の授業では C, Java、独学では Next.js を中心に、フロントエンド技術の基礎を学習中です。</p>
            <p>目標はフルスタックエンジニアで、0から1をひとりで製作できるようなエンジニアになることです。</p>
            <p>今後は学習した基礎を用いて作品を作っていこうと思います。</p>
          </div>

          <section className="mt-6">
            <h2 className="mb-2 text-2xl">Profile</h2>
            <ul className="pl-5 space-y-1 list-disc">
              <li>興味: フロントエンド、バックエンド</li>
              <li>強み: 忍耐力、分野の開拓</li>
              <li>開発環境: Next.js, TypeScript</li>
            </ul>
          </section>
        </div>
      </FadeInSection>

      <FadeInSection className="mt-12 mb-12 sm:mt-24 sm:mb-24 lg:mt-40 lg:mb-40" animation="fadeInLeft">
        <section className="px-5 sm:px-8 py-6 sm:py-8 rounded bg-white">
          <div className="mb-10">
            <h2 className="text-2xl mb-2">Timeline</h2>
            <p className="mt-1 text-sm font-medium tracking-wider uppercase text-slate-500">これまでの経歴</p>
          </div>
          <div className="py-4 ml-2 sm:ml-3 space-y-10 sm:space-y-12 border-l-2 border-slate-200 md:ml-6">
            {timeline.map((item) => (
              <div key={item.id} className="relative pl-8 md:pl-12 group">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-slate-300 group-hover:border-blue-500 transition-colors" />

                <div className="flex flex-col sm:flex-row gap-4 mb-2 w-full sm:w-auto items-start sm:items-center justify-between">
                  <div className="">
                    <span className="text-sm font-bold text-blue-700">
                      {item.year}.{item.month}
                    </span>
                    <h3 className="text-lg font-bold mb-4 border-blue-300 transition-all hover:border-b-4 hover:mb-3 text-slate-800 group-hover:text-blue-700">
                      {item.title}
                    </h3>
                  </div>
                  <p className="px-3 py-1 bg-blue-400 text-white rounded mx-0 sm:mx-4 text-sm">{item.category}</p>
                </div>
                <p className="leading-relaxed text-glay-300 text-sm sm:text-base">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>

      <FadeInSection className="mt-12 mb-12 sm:mt-24 sm:mb-24 lg:mt-40 lg:mb-40" animation="fadeInRight">
        <section className="px-5 sm:px-8 py-6 sm:py-8 rounded bg-white">
          <h2 className="mb-2 text-2xl">Skills</h2>
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
                  className="absolute z-10 px-3 py-2 mt-2 text-xs text-gray-800 whitespace-pre-line transition scale-95 -translate-x-1/2 translate-y-1 bg-white rounded-md shadow opacity-0 pointer-events-none left-1/2 top-full group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100"
                >
                  {tech.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>

      <FadeInSection className="mt-12 mb-12 sm:mt-24 sm:mb-24 lg:mt-40 lg:mb-40" animation="fadeInScale">
        <section className="px-5 sm:px-8 py-6 sm:py-8 rounded bg-white">
          <h2 className="text-center text-2xl">Contact</h2>
          <Link href="/contact"><p className="mx-auto m-4 text-white bg-blue-500 px-4 p-2 rounded w-fit hover:bg-blue-400">こちらからお気軽にご連絡ください。</p></Link>
        </section>
      </FadeInSection>

      <FadeInSection className="mt-12 mb-20 sm:mt-24 sm:mb-24 lg:mt-40 lg:mb-40" animation="fadeInDown">
        <section className="px-5 sm:px-8 py-6 sm:py-8 rounded bg-white max-w-lg mx-auto">
          <h2 className="text-center text-2xl">Links</h2>

          <ul className="flex space-x-4 justify-center">
            <li className="list-none">
              <Link
                href="https://x.com/papox_57"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 hover:bg-slate-50 transition-colors rounded"
              >
                <Image
                  src="/logos/logo-black.png"
                  alt="X (旧Twitter) ロゴ"
                  width={32}
                  height={32}
                  className=""
                />
                <span className="text-lg font-medium text-slate-800">
                  X (Twitter)
                </span>
              </Link>
            </li>
            <li className="list-none">
              <Link
                href="https://github.com/yabu1121"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 hover:bg-slate-50 transition-colors rounded"
              >
                <Image
                  src="/logos/github-mark.png"
                  alt="Github ロゴ"
                  width={32}
                  height={32}
                  className=""
                />
                <span className="text-lg font-medium text-slate-800">
                  Github
                </span>
              </Link>
            </li>
          </ul>
        </section>
      </FadeInSection>

    </div>
  )
}

export default AboutPage