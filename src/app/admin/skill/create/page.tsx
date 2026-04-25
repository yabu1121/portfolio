'use client'

import { api } from "@/trpc/client"
import { useRouter } from "next/navigation";
import { useRef } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const utils = api.useUtils();

  const { data: techs, isLoading } = api.tech.getAll.useQuery();

  const techIdRef = useRef<HTMLSelectElement>(null);
  const levelRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const createMutation = api.skill.create.useMutation({
    onSuccess: async () => {
      toast.success("登録しました");
      await utils.skill.getAll.invalidate();
      router.push('/admin');
    },
    onError: (e) => toast.error(`登録失敗: ${e.message}`),
  });

  if (isLoading) return <>loading...</>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      techId: techIdRef.current?.value ?? '',
      level: Number(levelRef.current?.value ?? 0),
      description: descRef.current?.value ?? '',
    });
  };

  return (
    <div>
      <div className="flex gap-4">
        <button type="button" onClick={() => router.back()}>戻る</button>
        <h1>スキル新規作成</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col my-4 space-y-4 max-w-5xl mx-auto">
        <label htmlFor="techId">技術</label>
        <select
          id="techId"
          ref={techIdRef}
          className="border p-4"
          required
          defaultValue=""
        >
          <option value="" disabled>選択してください</option>
          {techs?.map((tech) => (
            <option key={tech.id} value={tech.id}>{tech.name}</option>
          ))}
        </select>

        <label htmlFor="level">レベル (1-100)</label>
        <input
          id="level"
          type="number"
          ref={levelRef}
          min={1}
          max={100}
          defaultValue={30}
          className="border p-4"
          required
        />

        <label htmlFor="description">詳細</label>
        <textarea
          id="description"
          ref={descRef}
          rows={4}
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
