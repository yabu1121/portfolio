'use client'
import { api } from "@/trpc/client"
import Image from "next/image";
import { useParams } from "next/navigation";

const Page = () => {
  const {id} = useParams<{id: string}>();
  const { data, isLoading } = api.tech.getByID.useQuery({ id })
  if(isLoading)return <>loading...</>
  if(!data)return <>見つかりません</>
  return (
    <div>
      <p>{data.id}</p>
      <Image
        src={data.iconUrl ?? "/no_item.png"}
        alt={data.name}
        width={40}
        height={40}
      />
      <p>{data.name}</p>
      <p>{data.description}</p>
    </div>
  )
}

export default Page