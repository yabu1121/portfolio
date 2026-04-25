'use client'

import { api } from "@/trpc/client"
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();

  const { data, isLoading } = api.work.getByID.useQuery({ id });

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const githubUrlRef = useRef<HTMLInputElement>(null);
  const lpSiteUrlRef = useRef<HTMLInputElement>(null);
  const siteUrlRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const miniThumbnailRef = useRef<HTMLInputElement>(null);

  const updateMutation = api.work.update.useMutation({
    onSuccess: async () => {
      toast.success("更新しました");
      await utils.work.getAll.invalidate();
      await utils.work.getByID.invalidate({ id });
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
      title: titleRef.current?.value ?? '',
      description: descRef.current?.value ?? '',
      category: categoryRef.current?.value || null,
      githubUrl: githubUrlRef.current?.value || null,
      lpSiteUrl: lpSiteUrlRef.current?.value || null,
      siteUrl: siteUrlRef.current?.value || null,
      thumbnail: thumbnailRef.current?.value || null,
      miniThumbnail: miniThumbnailRef.current?.value || null,
    });
  };

  return (
    <div>
      <div className="flex gap-4">
        <button type="button" onClick={() => router.back()}>戻る</button>
        <h1>プロジェクト編集</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col my-4 space-y-4 max-w-5xl mx-auto">
        <label htmlFor="title">タイトル</label>
        <input id="title" type="text" ref={titleRef} defaultValue={data.title} className="border p-4" required />

        <label htmlFor="description">説明</label>
        <textarea id="description" ref={descRef} rows={6} defaultValue={data.description} className="border p-4" required />

        <label htmlFor="category">カテゴリ</label>
        <input id="category" type="text" ref={categoryRef} defaultValue={data.category ?? ''} className="border p-4" />

        <label htmlFor="githubUrl">GitHub URL</label>
        <input id="githubUrl" type="text" ref={githubUrlRef} defaultValue={data.githubUrl ?? ''} className="border p-4" />

        <label htmlFor="lpSiteUrl">LP URL</label>
        <input id="lpSiteUrl" type="text" ref={lpSiteUrlRef} defaultValue={data.lpSiteUrl ?? ''} className="border p-4" />

        <label htmlFor="siteUrl">サイト URL</label>
        <input id="siteUrl" type="text" ref={siteUrlRef} defaultValue={data.siteUrl ?? ''} className="border p-4" />

        <label htmlFor="thumbnail">サムネイル URL</label>
        <input id="thumbnail" type="text" ref={thumbnailRef} defaultValue={data.thumbnail ?? ''} className="border p-4" />

        <label htmlFor="miniThumbnail">ミニサムネイル URL</label>
        <input id="miniThumbnail" type="text" ref={miniThumbnailRef} defaultValue={data.miniThumbnail ?? ''} className="border p-4" />

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
