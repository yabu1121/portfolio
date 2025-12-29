'use client'

import Link from "next/link"

import { useEffect, useState } from "react"
import { links } from "@/app/utils/data"
import { Sprout, X } from "lucide-react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <>
      <header className="relative flex w-full justify-between items-center px-6 md:px-12 py-4 bg-white shadow-md z-40">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">hayato</h1>
        </div>

        <button
          type="button"
          className="sm:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-full border border-gray-200 text-gray-800"
          aria-label="メニューを開閉"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <Sprout />
        </button>

        <nav className="hidden sm:block">
          <ul className="flex gap-4">
            {links.map((item) => (
              <li key={item.id} className="hover:text-blue-600">
                <Link href={`/${item.link}`} className="text-gray-700 hover:text-blue-600">
                  <span>{item.topic}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white sm:hidden">
          <button
            type="button"
            className="absolute top-2 right-6 text-gray-700 hover:text-black text-5xl"
            aria-label="メニューを閉じる"
            onClick={closeMenu}
          >
            <X />
          </button>

          <nav className="flex h-full w-full items-center justify-center">
            <ul className="flex flex-col items-center gap-6 text-xl">
              {links.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/${item.link}`}
                    className="text-gray-800 hover:text-blue-600 transition-colors"
                    onClick={closeMenu}
                  >
                    {item.topic}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}

export default Header
