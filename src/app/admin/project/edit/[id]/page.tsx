'use client'

import { api } from "@/trpc/client"
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();

  const { data, isLoading } = api.work.getByID.useQuery({ id });
  const { data: allTechs } = api.tech.getAll.useQuery();

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const githubUrlRef = useRef<HTMLInputElement>(null);
  const lpSiteUrlRef = useRef<HTMLInputElement>(null);
  const siteUrlRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const miniThumbnailRef = useRef<HTMLInputElement>(null);

  // 技術スタックの紐付け状態（techId + 使用理由）。data 読み込み時に一度だけ初期化（レンダー中の状態調整パターン）
  const [links, setLinks] = useState<{ techId: string; description: string }[]>([]);
  const [initedFor, setInitedFor] = useState<string | null>(null);
  if (data && initedFor !== id) {
    const wtt = (data as { worksToTechs?: { techId: string; description: string | null }[] }).worksToTechs ?? [];
    setInitedFor(id);
    setLinks(wtt.map((w) => ({ techId: w.techId, description: w.description ?? '' })));
  }

  const isLinked = (techId: string) => links.some((l) => l.techId === techId);
  const toggle = (techId: string) =>
    setLinks((prev) =>
      prev.some((l) => l.techId === techId)
        ? prev.filter((l) => l.techId !== techId)
        : [...prev, { techId, description: '' }]
    );
  const setDesc = (techId: string, description: string) =>
    setLinks((prev) => prev.map((l) => (l.techId === techId ? { ...l, description } : l)));

  const updateMutation = api.work.update.useMutation({
    onSuccess: async () => {
      toast.success("基本情報を更新しました");
      await utils.work.getAll.invalidate();
      await utils.work.getByID.invalidate({ id });
    },
    onError: (e) => toast.error(`更新失敗: ${e.message}`),
  });

  const setTechsMutation = api.work.setTechs.useMutation({
    onSuccess: async () => {
      toast.success("技術スタックを保存しました");
      await utils.work.getByID.invalidate({ id });
      await utils.work.getAll.invalidate();
    },
    onError: (e) => toast.error(`保存失敗: ${e.message}`),
  });

  const [newTech, setNewTech] = useState({ name: '', description: '', iconUrl: '' });
  const createTech = api.tech.create.useMutation({
    onSuccess: async () => {
      toast.success("技術を追加しました");
      await utils.tech.getAll.invalidate();
      setNewTech({ name: '', description: '', iconUrl: '' });
    },
    onError: (e) => toast.error(`追加失敗: ${e.message}`),
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

  const saveTechs = () => {
    setTechsMutation.mutate({
      workId: id,
      techs: links.map((l) => ({ techId: l.techId, description: l.description || null })),
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

        <label htmlFor="description">説明（Markdown対応：## 見出し / - 箇条書き / **強調** / ```コード```）</label>
        <textarea id="description" ref={descRef} rows={12} defaultValue={data.description} className="border p-4 font-mono text-sm" required />

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
        >{updateMutation.isPending ? '更新中...' : '基本情報を更新'}</button>
      </form>

      <section className="max-w-5xl mx-auto my-12 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Technology Stack</h2>
        <p className="text-sm text-gray-500 mb-4">使う技術を選び、それぞれに「使用理由」を書けます。選択後に「技術スタックを保存」を押してください。</p>

        <div className="grid md:grid-cols-2 gap-4">
          {allTechs?.slice().sort((a, b) => a.name.localeCompare(b.name)).map((tech) => {
            const linked = isLinked(tech.id);
            const link = links.find((l) => l.techId === tech.id);
            return (
              <div key={tech.id} className={`border rounded-xl p-4 ${linked ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <label className="flex items-center gap-2 cursor-pointer font-semibold">
                  <input type="checkbox" checked={linked} onChange={() => toggle(tech.id)} />
                  {tech.name}
                </label>
                {linked && (
                  <textarea
                    value={link?.description ?? ''}
                    onChange={(e) => setDesc(tech.id, e.target.value)}
                    rows={2}
                    placeholder="使用理由（例：並列処理と高速性を重視して採用）"
                    className="border w-full mt-2 p-2 text-sm rounded"
                  />
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={saveTechs}
          disabled={setTechsMutation.isPending}
          className="bg-emerald-500 disabled:bg-gray-400 cursor-pointer text-white rounded-2xl w-52 mx-auto py-2 block mt-6"
        >{setTechsMutation.isPending ? '保存中...' : '技術スタックを保存'}</button>

        <div className="border rounded-xl p-4 mt-8 bg-gray-50">
          <h3 className="font-semibold mb-3">技術を新規追加</h3>
          <div className="flex flex-col gap-2">
            <input
              type="text" placeholder="名前（例：Go）" value={newTech.name}
              onChange={(e) => setNewTech({ ...newTech, name: e.target.value })} className="border p-2 rounded"
            />
            <input
              type="text" placeholder="説明（一覧に表示される短い説明）" value={newTech.description}
              onChange={(e) => setNewTech({ ...newTech, description: e.target.value })} className="border p-2 rounded"
            />
            <input
              type="text" placeholder="アイコンURL（任意）" value={newTech.iconUrl}
              onChange={(e) => setNewTech({ ...newTech, iconUrl: e.target.value })} className="border p-2 rounded"
            />
            <button
              type="button"
              disabled={createTech.isPending || !newTech.name}
              onClick={() => createTech.mutate({
                name: newTech.name,
                description: newTech.description || null,
                iconUrl: newTech.iconUrl || null,
              })}
              className="bg-gray-700 disabled:bg-gray-400 cursor-pointer text-white rounded-xl w-40 py-2"
            >{createTech.isPending ? '追加中...' : '技術を追加'}</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page
