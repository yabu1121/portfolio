'use client'

import { api } from "@/trpc/client"
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();

  const { data, isLoading } = api.event.getByID.useQuery({ id });

  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);

  const updateMutation = api.event.update.useMutation({
    onSuccess: async () => {
      toast.success("更新しました");
      await utils.event.getAll.invalidate();
      await utils.event.getByID.invalidate({ id });
      router.push('/admin');
    },
    onError: (e) => toast.error(`更新失敗: ${e.message}`),
  });

  if (isLoading) return <>loading...</>
  if (!data) return <>見つかりません</>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        id,
        year: Number(yearRef.current?.value ?? 0),
        month: Number(monthRef.current?.value ?? 0),
        name: nameRef.current?.value ?? '',
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex gap-4">
        <button type="button" onClick={() => router.back()}>戻る</button>
        <h1>イベント編集</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col my-4 space-y-4 max-w-5xl mx-auto">
        <label htmlFor="year">年</label>
        <input
          id="year"
          type="number"
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

        <label htmlFor="name">イベント名</label>
        <input
          id="name"
          type="text"
          ref={nameRef}
          defaultValue={data.name}
          className="border p-4"
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-400 disabled:bg-gray-400 cursor-pointer text-white rounded-2xl w-40 mx-auto py-2"
        >{submitting ? '更新中...' : '更新'}</button>
      </form>
    </div>
  )
}

export default Page
