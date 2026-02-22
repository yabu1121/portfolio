import { ActivityIcon, Highlighter, Rabbit, Send, UserRound } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className='md:hidden bottom-0 fixed w-screen'>
      <ul className="bg-slate-300 flex justify-between w-full h-full">
        <li className="w-1/5 h-full flex items-center justify-center text-sm py-4">
          <Link href="/">
            <div>
              <UserRound className="mx-auto" />
              <p>Top</p>
            </div>
          </Link>
        </li>
        <li className="w-1/5 h-full flex items-center justify-center text-sm py-4">
          <Link href="/about">
            <div>
              <Highlighter className="mx-auto" />
              <p>About</p>
            </div>
          </Link>
        </li>
        <li className="w-1/5 h-full flex items-center justify-center text-sm py-4">
          <Link href="/projects">
            <div>
              <ActivityIcon className="mx-auto" />
              <p>Works</p>
            </div>
          </Link>
        </li>
        <li className="w-1/5 h-full flex items-center justify-center text-sm py-4">
          <Link href="/contact">
            <div>
              <Send className="mx-auto" />
              <p>Contact</p>
            </div>
          </Link>
        </li>
        <li className="w-1/5 h-full flex items-center justify-center text-sm py-4">
          <Link href="/links">
            <div>
              <Rabbit className="mx-auto" />
              <p>Links</p>
            </div>
          </Link>
        </li>
      </ul>
    </footer>
  )
}

export default Footer