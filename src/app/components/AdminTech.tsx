'use client'
import { api } from "@/trpc/client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AdminTech = () => {
  const router = useRouter();
  const { data, isLoading, isError } = api.tech.getAll.useQuery();
  const utils = api.useUtils();
  if(isLoading) return <>loading...</>
  if(isError) return <>error</>

  return (
    <div>
      <h1>スキル情報管理</h1>
      <div>{data?.map((tech) => {
        return (
          <div key={tech.id} className="flex justify-between items-center my-4 rounded-2xl">
            <Image src={tech.iconUrl ?? "/no_item.png"} alt={tech.name} width={40} height={40} />
            <p className="w-40 font-bold">{tech.name}</p>
            <p className="w-120">{tech.description}</p>
            <Link
              href={`admin//tech/edit/${tech.id}`} 
              className="text-center text-white bg-blue-400 w-20 font-semibold rounded cursor-pointer" 
              >編集
            </Link>
            <Link
              href={`admin//tech/edit/${tech.id}`} 
              className="text-center text-white bg-red-400 w-20 font-semibold rounded cursor-pointer" 
              >削除
            </Link>
          </div>
        )
      })}</div>
    </div>
  )
}

export default AdminTech