import Link from "next/link"
import {links} from "@/app/utils/data"

const Header = () => {
  return (
    <header className="flex w-full justify-between items-center px-6 md:px-12 py-4 bg-white shadow-md">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">hayato</h1>
      </div>
      <nav>
        <ul className="flex gap-4">
          {links.map((item) => {
              return(
              <li key={item.id} className="hover:text-blue-600">
                <Link href={`/${item.link}`} className="text-gray-700 hover:text-blue-600">
                  <span>{item.topic}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

export default Header