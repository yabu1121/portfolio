'use client'
import { api } from "@/trpc/client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TECH_KIND_LABEL, TechKind } from "@/app/utils/techKind";

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
            <p className={`w-32 shrink-0 text-center text-xs rounded px-2 py-1 ${
              tech.kind === 'language' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'
            }`}>{TECH_KIND_LABEL[tech.kind as TechKind] ?? tech.kind}</p>
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