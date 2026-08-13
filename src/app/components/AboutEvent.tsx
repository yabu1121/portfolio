'use client'

import { api } from "@/trpc/client"
import Section from "./common/Section"

const AboutEvent = () => {
  const {data, isLoading, isError} = api.event.getAll.useQuery()
  if(isLoading)return <>loading...</>
  if(isError)return <>error</>
  return (
    <Section className="bg-white rounded">
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
    </Section>
  )
}

export default AboutEvent