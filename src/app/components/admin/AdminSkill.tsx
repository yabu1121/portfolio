'use client'

import { api } from "@/trpc/client"
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import Loading from "../common/AdminLoading";
import Error from "../common/Error";

const AdminSkill = () => {
  const utils = api.useUtils();
  const { data, isLoading, error } = api.skill.getAll.useQuery();

  const deleteMutation = api.skill.delete.useMutation({
    onSuccess: async () => {
      toast.success("削除しました");
      await utils.skill.getAll.invalidate();
    },
    onError: (e) => toast.error(`削除失敗: ${e.message}`),
  });

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    deleteMutation.mutate({ id });
  };

  return (
    <div>
      <div className="flex justify-between items-center my-4 mt-20">
        <h1 className="font-bold">スキル管理</h1>
        <Link
          href="/admin/skill/create"
          className="text-center text-white bg-green-500 px-4 py-1.5 font-semibold rounded cursor-pointer text-sm"
        >
          新規作成
        </Link>
      </div>

      <div>
        {data?.map((skill) => (
          <div
            key={skill.id}
            className="flex justify-between items-center my-4 rounded-2xl"
          >
            <Image
              src={skill.iconUrl ?? "/logos/no_item.png"}
              alt={skill.name}
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <p className="w-40 font-bold">{skill.name}</p>
            <p className="w-16">{skill.level}%</p>
            <p className="w-96 truncate">{skill.description}</p>
            <Link
              href={`/admin/skill/edit/${skill.id}`}
              className="text-center text-white bg-blue-400 w-20 font-semibold rounded cursor-pointer"
            >
              編集
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(skill.id, skill.name)}
              disabled={deleteMutation.isPending}
              className="text-center text-white bg-red-400 w-20 font-semibold rounded cursor-pointer disabled:opacity-50"
            >
              {deleteMutation.isPending ? "削除中..." : "削除"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminSkill
