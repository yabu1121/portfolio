'use client'

import { api } from "@/trpc/client"
import Link from "next/link";
import toast from "react-hot-toast";
import Loading from "../common/AdminLoading";
import Error from "../common/Error";

const AdminTimeline = () => {
  const utils = api.useUtils();
  const { data, isLoading, error } = api.timeline.getAll.useQuery();

  const deleteMutation = api.timeline.delete.useMutation({
    onSuccess: async () => {
      toast.success("削除しました");
      await utils.timeline.getAll.invalidate();
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
        <h1 className="font-bold">タイムライン管理</h1>
        <Link
          href="/admin/timeline/create"
          className="text-center text-white bg-green-500 px-4 py-1.5 font-semibold rounded cursor-pointer text-sm"
        >
          新規作成
        </Link>
      </div>

      <div>
        {data?.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center my-4 rounded-2xl"
          >
            <p className="w-20">{item.year}年</p>
            <p className="w-16">{item.month}月</p>
            <p className="w-28">{item.category}</p>
            <p className="w-96">{item.title}</p>
            <Link
              href={`/admin/timeline/edit/${item.id}`}
              className="text-center text-white bg-blue-400 w-20 font-semibold rounded cursor-pointer"
            >
              編集
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(item.id, item.title)}
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

export default AdminTimeline
