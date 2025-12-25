'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

const TopPage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 transition-transform duration-1000 ease-out">
        <Image
          src="/images/heroimage.png"
          alt="heroimage"
          width={1600}
          height={900}
          priority
          className="w-full h-full object-cover"
        />
      </div>

       {/* 半透明レイヤーを前面に配置することにより、背景色を薄暗くし、白い文字を目立たせる。 */}
      <div className="absolute inset-0 bg-black opacity-[0.4]" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className={`text-6xl md:text-8xl font-bold text-white tracking-wide transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            hayato
          </h1>

          <p className={`text-m md:text-2xl text-white/90 font-light tracking-wide transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            Web Developer & Creative Problem Solver
          </p>

          <div className={`flex gap-8 justify-center mt-16 transition-all duration-1000 delay-1400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <Link
              href="/about"
              className="group relative px-10 py-4 bg-white text-black font-medium rounded-full transition-all duration-500 hover:shadow-2xl hover:scale-110 hover:rotate-2"
            >
              <span className="relative z-10">About Me</span>
              <span className="absolute inset-0 rounded-full duration-300" />
            </Link>

            <Link
              href="/projects"
              className="group relative px-10 py-4 bg-transparent text-white border-2 border-white font-medium rounded-full transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:rotate-[-2deg]"
            >
              <span className="relative z-10 ">View Projects</span>
              <span className="absolute inset-0 rounded-full bg-transparent transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopPage