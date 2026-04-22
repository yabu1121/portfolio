'use client'

import { api } from "@/trpc/client"
import { useRouter } from "next/navigation";
import { useRef } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const utils = api.useUtils();

  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLTextAreaElement>(null);

  const createMutation = api.timeline.create.useMutation({
    onSuccess: async () => {
      toast.success("登録しました");
      await utils.timeline.getAll.invalidate();
      router.push('/admin');
    },
    onError: (e) => toast.error(`登録失敗: ${e.message}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
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
        <h1>タイムライン新規作成</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col my-4 space-y-4 max-w-5xl mx-auto">
        <label htmlFor="year">年</label>
        <input
          id="year"
          type="text"
          ref={yearRef}
          defaultValue={String(new Date().getFullYear())}
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
          defaultValue={new Date().getMonth() + 1}
          className="border p-4"
          required
        />

        <label htmlFor="category">カテゴリ</label>
        <input
          id="category"
          type="text"
          ref={categoryRef}
          className="border p-4"
          required
        />

        <label htmlFor="title">タイトル</label>
        <input
          id="title"
          type="text"
          ref={titleRef}
          className="border p-4"
          required
        />

        <label htmlFor="detail">詳細</label>
        <textarea
          id="detail"
          ref={detailRef}
          rows={6}
          className="border p-4"
          required
        />

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-blue-400 disabled:bg-gray-400 cursor-pointer text-white rounded-2xl w-40 mx-auto py-2"
        >{createMutation.isPending ? '登録中...' : '登録'}</button>
      </form>
    </div>
  )
}

export default Page
