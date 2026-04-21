'use client'
import { api } from "@/trpc/client"
import Image from "next/image";

const AdminTech = () => {
  const { data, isLoading, isError } = api.tech.getAll.useQuery();
  if(isLoading) return <>loading...</>
  if(isError) return <>error</>

  return (
    <div>
      <h1>スキル情報管理</h1>
      <div>{data?.map((tech) => {
        return (
          <div key={tech.id} className="flex justify-between items-center my-4 rounded-2xl">
            <Image src={tech.iconUrl ?? "/no_item.png"} alt={tech.name} width={40} height={40} />
            <p className="w-80 text-sm">{tech.id}</p>
            <p className="w-40 font-bold">{tech.name}</p>
            <p className="w-120">{tech.description}</p>
            <button className="text-white bg-blue-400 font-semibold rounded cursor-pointer">編集</button>
            <button className="text-white bg-red-400 font-semibold rounded cursor-pointer">削除</button>
          </div>
        )
      })}</div>
    </div>
  )
}

export default AdminTech