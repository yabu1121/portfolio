import ReturnTopButton from "@/app/components/ReturnTopButton"
import Link from "next/link"

import { techs, timeline } from "@/app/utils/data"
import Image from "next/image"
import Aboutme from "@/app/components/Aboutme"
import AboutProfile from "@/app/components/AboutProfile"
import AboutTimeline from "@/app/components/AboutTimeline"
import AboutSkills from "@/app/components/AboutSkills"

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <Aboutme />
        <AboutProfile />
        <AboutTimeline />
        <AboutSkills />

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