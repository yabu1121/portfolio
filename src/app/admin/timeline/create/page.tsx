'use client'

import { api } from "@/trpc/client"
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

// 入力欄が空なら null、値があれば数値にする。
// day / endMonth / endDay は「未指定」を null で表すため。
// textarea の内容を1行1URLとして配列にする。空行は捨て、全部空なら null。
const toUrlList = (v: string | undefined) => {
  const list = (v ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
  return list.length ? list : null;
};

const toNullableNumber = (v: string | undefined) => {
  if (v == null || v.trim() === '') return null;
  return Number(v);
};

const Page = () => {
  const router = useRouter();
  const utils = api.useUtils();

  // 継続中のときは終了日の入力欄を無効化するので state で持つ
  const [isOngoing, setIsOngoing] = useState(false);

  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const endYearRef = useRef<HTMLInputElement>(null);
  const endMonthRef = useRef<HTMLInputElement>(null);
  const endDayRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLTextAreaElement>(null);
  const urlsRef = useRef<HTMLTextAreaElement>(null);

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
    const endYear = endYearRef.current?.value?.trim();
    createMutation.mutate({
      year: yearRef.current?.value ?? '',
      month: Number(monthRef.current?.value ?? 0),
      day: toNullableNumber(dayRef.current?.value),
      endYear: isOngoing || !endYear ? null : endYear,
      endMonth: isOngoing ? null : toNullableNumber(endMonthRef.current?.value),
      endDay: isOngoing ? null : toNullableNumber(endDayRef.current?.value),
      isOngoing,
      category: categoryRef.current?.value ?? '',
      title: titleRef.current?.value ?? '',
      detail: detailRef.current?.value ?? '',
      urls: toUrlList(urlsRef.current?.value),
    });
  };

  return (
    <div>
      <div className="flex gap-4">
        <button type="button" onClick={() => router.back()}>戻る</button>
        <h1>タイムライン新規作成</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col my-4 space-y-4 max-w-5xl mx-auto">
        <fieldset className="border p-4 space-y-3">
          <legend className="px-2 font-medium">開始</legend>

          <label htmlFor="year" className="block">年</label>
          <input
            id="year"
            type="text"
            ref={yearRef}
            defaultValue={String(new Date().getFullYear())}
            className="border p-4 w-full"
            required
          />

          <label htmlFor="month" className="block">月</label>
          <input
            id="month"
            type="number"
            ref={monthRef}
            min={1}
            max={12}
            defaultValue={new Date().getMonth() + 1}
            className="border p-4 w-full"
            required
          />

          <label htmlFor="day" className="block">日（任意・空なら月単位で表示）</label>
          <input
            id="day"
            type="number"
            ref={dayRef}
            min={1}
            max={31}
            className="border p-4 w-full"
          />
        </fieldset>

        <fieldset className="border p-4 space-y-3">
          <legend className="px-2 font-medium">終了</legend>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isOngoing}
              onChange={(e) => setIsOngoing(e.target.checked)}
            />
            現在も継続中（「2024.04 – 現在」と表示）
          </label>

          <p className="text-sm text-gray-500">
            継続中でもなく終了年月も空なら、単発の予定として「2024.10」のように開始日だけを表示します。
          </p>

          <label htmlFor="endYear" className="block">終了年（任意）</label>
          <input
            id="endYear"
            type="text"
            ref={endYearRef}
            disabled={isOngoing}
            className="border p-4 w-full disabled:bg-gray-100"
          />

          <label htmlFor="endMonth" className="block">終了月（終了年とセットで必須）</label>
          <input
            id="endMonth"
            type="number"
            ref={endMonthRef}
            min={1}
            max={12}
            disabled={isOngoing}
            className="border p-4 w-full disabled:bg-gray-100"
          />

          <label htmlFor="endDay" className="block">終了日（任意）</label>
          <input
            id="endDay"
            type="number"
            ref={endDayRef}
            min={1}
            max={31}
            disabled={isOngoing}
            className="border p-4 w-full disabled:bg-gray-100"
          />
        </fieldset>

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

        <label htmlFor="urls">関連リンク（任意・複数可）</label>
        <textarea
          id="urls"
          ref={urlsRef}
          rows={3}
          placeholder={"https://speakerdeck.com/...\nhttps://zenn.dev/..."}
          className="border p-4"
        />
        <p className="text-xs text-gray-500">1行に1つ。登壇資料・記事・リポジトリなど。speakerdeck / zenn / qiita / github はラベルを自動判別する</p>

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
