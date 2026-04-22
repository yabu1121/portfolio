'use client'

import { api } from "@/trpc/client"
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();

  const { data, isLoading } = api.timeline.getByID.useQuery({ id });

  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLTextAreaElement>(null);

  const updateMutation = api.timeline.update.useMutation({
    onSuccess: async () => {
      toast.success("更新しました");
      await utils.timeline.getAll.invalidate();
      await utils.timeline.getByID.invalidate({ id });
      router.push('/admin');
    },
    onError: (e) => toast.error(`更新失敗: ${e.message}`),
  });

  if (isLoading) return <>loading...</>
  if (!data) return <>見つかりません</>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id,
      year: yearRef.current?.value ?? '',
      month: Number(monthRef.current?.value ?? 0),
      category: categoryRef.current?.value ?? '',
      title: titleRef.current?.value ?? '',
      detail: detailRef.current?.value ?? '',
    });
  };

  return (
    <div>
      <div className="flex gap-4">
        <button type="button" onClick={() => router.back()}>戻る</button>
        <h1>タイムライン編集</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col my-4 space-y-4 max-w-5xl mx-auto">
        <label htmlFor="year">年</label>
        <input
          id="year"
          type="text"
          ref={yearRef}
          defaultValue={data.year}
          className="border p-4"
          required
        />

        <label htmlFor="month">月</label>
        <input
          id="month"
          type="number"
          ref={monthRef}
          min={1}
          max={12}
          defaultValue={data.month}
          className="border p-4"
          required
        />

        <label htmlFor="category">カテゴリ</label>
        <input
          id="category"
          type="text"
          ref={categoryRef}
          defaultValue={data.category}
          className="border p-4"
          required
        />

        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          type="text"
          ref={titleRef}
          defaultValue={data.title}
          className="border p-4"
          required
        />

        <label htmlFor="detail">詳細</label>
        <textarea
          id="detail"
          ref={detailRef}
          rows={6}
          defaultValue={data.detail}
          className="border p-4"
          required
        />

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-blue-400 disabled:bg-gray-400 cursor-pointer text-white rounded-2xl w-40 mx-auto py-2"
        >{updateMutation.isPending ? '更新中...' : '更新'}</button>
      </form>
    </div>
  )
}

export default Page
