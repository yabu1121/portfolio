'use client'

import { api } from "@/trpc/client"

const AboutEvent = () => {
  const {data} = api.event.getAll.useQuery()
  return (
    <section className="px-5 sm:px-8 py-6 sm:py-8 bg-white my-4 rounded">
      <div className="mb-10">
        <h2 className="text-2xl mb-2 font-medium">Event</h2>
        <p className="text-xs">参加してきたイベントなど</p>
        <div className="mt-4 space-y-2 px-3 py-3 text-sm sm:text-base leading-relaxed">
          <ul>
            {data?.map((item) => (
              <li key={item.id}>{item.year}年{item.month}月{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default AboutEvent