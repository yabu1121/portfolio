import Image from "next/image"
import Link from "next/link"

const AboutLinks = () => {
  return (
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
              alt="Xのロゴ"
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
  )
}

export default AboutLinks