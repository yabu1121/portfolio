'use client'

import { api } from "@/trpc/client"
import { useRouter } from "next/navigation";
import { useRef } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const utils = api.useUtils();

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const githubUrlRef = useRef<HTMLInputElement>(null);
  const lpSiteUrlRef = useRef<HTMLInputElement>(null);
  const siteUrlRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const miniThumbnailRef = useRef<HTMLInputElement>(null);

  const createMutation = api.work.create.useMutation({
    onSuccess: async () => {
      toast.success("登録しました");
      await utils.work.getAll.invalidate();
      router.push('/admin');
    },
    onError: (e) => toast.error(`登録失敗: ${e.message}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
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
        <h1>プロジェクト新規作成</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col my-4 space-y-4 max-w-5xl mx-auto">
        <label htmlFor="title">タイトル</label>
        <input id="title" type="text" ref={titleRef} className="border p-4" required />

        <label htmlFor="description">説明</label>
        <textarea id="description" ref={descRef} rows={6} className="border p-4" required />

        <label htmlFor="category">カテゴリ</label>
        <input id="category" type="text" ref={categoryRef} className="border p-4" placeholder="例: self / udemy / ai" />

        <label htmlFor="githubUrl">GitHub URL</label>
        <input id="githubUrl" type="text" ref={githubUrlRef} className="border p-4" />

        <label htmlFor="lpSiteUrl">LP URL</label>
        <input id="lpSiteUrl" type="text" ref={lpSiteUrlRef} className="border p-4" />

        <label htmlFor="siteUrl">サイト URL</label>
        <input id="siteUrl" type="text" ref={siteUrlRef} className="border p-4" />

        <label htmlFor="thumbnail">サムネイル URL</label>
        <input id="thumbnail" type="text" ref={thumbnailRef} className="border p-4" />

        <label htmlFor="miniThumbnail">ミニサムネイル URL</label>
        <input id="miniThumbnail" type="text" ref={miniThumbnailRef} className="border p-4" />

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
