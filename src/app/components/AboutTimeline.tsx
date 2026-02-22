import React from 'react'
import { timeline } from '../utils/data'

const AboutTimeline = () => {
  return (
    <section className="px-5 sm:px-8 py-6 sm:py-8 bg-white my-4 rounded">
      <div className="mb-10">
        <h2 className="text-2xl mb-2 font-medium">Timeline</h2>
        <p className="mt-1 text-sm font-medium tracking-wider uppercase text-slate-500">これまでの経歴</p>
      </div>
      <div className="py-4 ml-2 sm:ml-3 space-y-10 sm:space-y-12 border-l-2 border-slate-200 md:ml-6">
        {timeline.map((item) => (
          <div key={item.id} className="relative pl-8 md:pl-12 group">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-slate-300 group-hover:border-blue-500 transition-colors" />
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
  )
}

export default AboutTimeline