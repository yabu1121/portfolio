import ReturnTopButton from "@/app/components/ReturnTopButton"
import Link from "next/link"

import { techs, timeline } from "@/app/utils/data"
import Image from "next/image"
import Aboutme from "@/app/components/Aboutme"
import AboutProfile from "@/app/components/AboutProfile"
import AboutTimeline from "@/app/components/AboutTimeline"

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <Aboutme />
        <AboutProfile />
        <AboutTimeline />


        <section className="px-5 sm:px-8 py-6 sm:py-8 bg-white rounded my-8">
          <h2 className="mb-2 text-2xl font-medium">Skills</h2>
          <div className="space-y-3">
            {techs.map((tech) => (
              <div key={tech.id} className="relative group">
                <div className="flex justify-between text-sm">
                  <span tabIndex={0} className="outline-none">{tech.name}</span>
                  <span className="text-gray-600">{tech.level}%</span>
                </div>

                <div className="w-full h-2">
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

        <section className="px-5 sm:px-8 py-6 sm:py-8 bg-white rounded my-4">
          <h2 className="text-center text-2xl font-medium">Contact</h2>
          <Link href="/contact"><p className="mx-auto m-4 text-white bg-blue-500 px-4 p-2 rounded w-fit hover:bg-blue-400">こちらからお気軽にご連絡ください。</p></Link>
        </section>

        <section className="px-5 sm:px-8 py-6 sm:py-8 max-w-lg mx-auto bg-white space-y-8 my-4 rounded">
          <h2 className="text-center text-2xl font-medium">Links</h2>

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
    </div>
  )
}

export default AboutPage