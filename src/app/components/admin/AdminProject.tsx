'use client'

import { api } from "@/trpc/client"
import Link from "next/link";
import toast from "react-hot-toast";
import Loading from "../common/AdminLoading";
import Error from "../common/Error";

const AdminProject = () => {
  const utils = api.useUtils();
  const { data, isLoading, error } = api.work.getAll.useQuery();

  const deleteMutation = api.work.delete.useMutation({
    onSuccess: async () => {
      toast.success("削除しました");
      await utils.work.getAll.invalidate();
    },
    onError: (e) => toast.error(`削除失敗: ${e.message}`),
  });

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`「${title}」を削除しますか？`)) return;
    deleteMutation.mutate({ id });
  };

  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h1 className="font-bold">プロジェクト管理</h1>
        <Link
          href="/admin/project/create"
          className="text-center text-white bg-green-500 px-4 py-1.5 font-semibold rounded cursor-pointer text-sm"
        >
          新規作成
        </Link>
      </div>

      <div>
        {data?.map((work) => (
          <div
            key={work.id}
            className="flex justify-between items-center my-4 rounded-2xl"
          >
            <p className="w-28 text-xs text-gray-500">{work.category ?? "-"}</p>
            <p className="w-96 font-bold truncate">{work.title}</p>
            <p className="w-96 text-sm text-gray-600 truncate">{work.description}</p>
            <Link
              href={`/admin/project/edit/${work.id}`}
              className="text-center text-white bg-blue-400 w-20 font-semibold rounded cursor-pointer"
            >
              編集
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(work.id, work.title)}
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

export default AdminProject