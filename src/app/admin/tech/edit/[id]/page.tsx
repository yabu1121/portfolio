'use client'
import { api } from "@/trpc/client"
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { id } = useParams<{id: string}>();
  const router = useRouter();
  const { data, isLoading } = api.tech.getByID.useQuery({ id })
  const utils = api.useUtils();

  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const updateMutation = api.tech.update.useMutation({
    onSuccess: async () => {
      toast('更新しました');
      await utils.tech.getAll.invalidate();
      await utils.tech.getByID.invalidate({ id });
      router.push('/admin');
    },
    onError: (e) => toast(`更新失敗: ${e.message}`),
  });

  if(isLoading)return <>loading...</>
  if(!data)return <>見つかりません</>

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message ?? 'upload failed');
    return json.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const file = fileRef.current?.files?.[0];
      let iconUrl: string | null = data.iconUrl ?? null;
      if (file) {
        iconUrl = await uploadImage(file);
      }

      await updateMutation.mutateAsync({
        id,
        name: nameRef.current?.value ?? '',
        description: descRef.current?.value || null,
        iconUrl,
      });
    } catch (err) {
      toast(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  const displayIcon = previewUrl ?? data.iconUrl ?? '/logos/no_item.png';

  return (
    <div>
      <div className="flex gap-4">
        <button type="button" onClick={() => router.back()}>戻る</button>
        <h1>tech編集</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col my-4 space-y-4 max-w-5xl mx-auto">
        <label htmlFor="name">tech name</label>
        <input
          id="name"
          type="text"
          ref={nameRef}
          defaultValue={data.name}
          className="border p-4"
          required
        />

        <label htmlFor="desc">description</label>
        <textarea
          id="desc"
          ref={descRef}
          defaultValue={data.description ?? ''}
          className="border p-4"
        />

        <label htmlFor="icon">icon</label>
        <div className="flex items-center gap-4">
          <Image
            src={displayIcon}
            alt={data.name}
            width={60}
            height={60}
            className="border rounded"
            unoptimized
          />
          <input
            id="icon"
            type="file"
            ref={fileRef}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-xs text-gray-500">未選択なら現在の画像のまま（最大2MB）</p>

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
