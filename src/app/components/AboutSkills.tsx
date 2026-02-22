'use client'
import { api } from "@/trpc/client"
import Loading from "./common/Loading";
import Error from "./common/Error";
import Image from "next/image";
import { useState } from "react";

const AboutSkills = () => {
  const { data: skillData, isLoading, error } = api.skill.getAll.useQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;


  const handleToggle = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };
  return (
    <section className="px-6 py-12 bg-gray-50/50 rounded-3xl my-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Technical Skills</h2>
          <p className="text-gray-500 text-sm">これまでに少しでも触れてきた技術の習熟度です</p>
        </header>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {skillData?.filter((item) => !!item.description).map((item) => {
            const isOpen = selectedId === item.id;
            return(
              <div 
                key={item.id} 
                onClick={() => handleToggle(item.id)}
                className="group relative bg-white p-5 rounded-2xl border border-black/30 cursor-pointer border-dashed shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 mb-4 relative p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                  {item.iconUrl ? (
                    <Image
                      src={item.iconUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">No Image</div>
                  )}
                </div>

                <h3 className="font-bold text-gray-800 text-xs mb-1 truncate">{item.name}</h3>
                
                <div className="w-full bg-red-900 h-1 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-yellow-200 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${item.level ? item.level : 0}%` }}
                  />
                </div>

                <div className={`
                    absolute inset-0 z-10 transition-all duration-300 bg-white/95 rounded-2xl p-4 flex items-center justify-center text-xs text-gray-600 leading-relaxed shadow-2xl
                    ${isOpen ? "opacity-100 z-30 pointer-events-auto rotate-y-360" : "opacity-0 pointer-events-none"}
                  `}>
                    {item.description}
                  </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AboutSkills