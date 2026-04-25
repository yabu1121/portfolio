'use client'

import { api } from "@/trpc/client"
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();

  const { data, isLoading } = api.skill.getByID.useQuery({ id });
  const { data: techs, isLoading: isTechsLoading } = api.tech.getAll.useQuery();

  const techIdRef = useRef<HTMLSelectElement>(null);
  const levelRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const updateMutation = api.skill.update.useMutation({
    onSuccess: async () => {
      toast.success("更新しました");
      await utils.skill.getAll.invalidate();
      await utils.skill.getByID.invalidate({ id });
      router.push('/admin');
    },
    onError: (e) => toast.error(`更新失敗: ${e.message}`),
  });

  if (isLoading || isTechsLoading) return <>loading...</>
  if (!data) return <>見つかりません</>

  const currentTech = techs?.find((t) => t.name === data.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id,
      techId: techIdRef.current?.value ?? '',
      level: Number(levelRef.current?.value ?? 0),
      description: descRef.current?.value ?? '',
    });
  };

  return (
    <div>
      <div className="flex gap-4">
        <button type="button" onClick={() => router.back()}>戻る</button>
        <h1>スキル編集</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col my-4 space-y-4 max-w-5xl mx-auto">
        <label htmlFor="techId">技術</label>
        <select
          id="techId"
          ref={techIdRef}
          className="border p-4"
          required
          defaultValue={currentTech?.id ?? ''}
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
          defaultValue={data.level}
          className="border p-4"
          required
        />

        <label htmlFor="description">詳細</label>
        <textarea
          id="description"
          ref={descRef}
          rows={4}
          defaultValue={data.description ?? ''}
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
