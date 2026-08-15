'use client'

import { api } from "@/trpc/client"
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  FormActions,
  FormPage,
  FormRow,
} from "@/app/components/admin/ui/FormPage";

const BACK = "/admin?tab=projects";

const Page = () => {
  const router = useRouter();
  const utils = api.useUtils();

  /* 既存の分類を候補に出して、表記のばらつきを防ぐ */
  const { data: works } = api.work.getAll.useQuery();
  const categories = [
    ...new Set((works ?? []).map((w) => w.category).filter(Boolean)),
  ] as string[];

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
      router.push(BACK);
    },
    onError: (e) => toast.error("登録に失敗しました", { description: e.message }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title: titleRef.current?.value ?? "",
      description: descRef.current?.value ?? "",
      category: categoryRef.current?.value || null,
      githubUrl: githubUrlRef.current?.value || null,
      lpSiteUrl: lpSiteUrlRef.current?.value || null,
      siteUrl: siteUrlRef.current?.value || null,
      thumbnail: thumbnailRef.current?.value || null,
      miniThumbnail: miniThumbnailRef.current?.value || null,
    });
  };

  return (
    <FormPage
      title="プロジェクトを追加"
      backHref={BACK}
      description="登録後、編集画面で使用技術を紐付けられます"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormRow id="title" label="タイトル" required>
          <Input id="title" type="text" ref={titleRef} required />
        </FormRow>

        <FormRow
          id="description"
          label="説明"
          hint="Markdown 可（## 見出し / - 箇条書き / **強調**）"
          required
        >
          <Textarea id="description" ref={descRef} rows={8} required />
        </FormRow>

        <FormRow id="category" label="分類" hint="既存の分類から選ぶか、新しく入力します">
          <Input
            id="category"
            type="text"
            ref={categoryRef}
            list="work-categories"
            placeholder="例: self / web game"
            className="sm:w-72"
          />
          <datalist id="work-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </FormRow>

        <Separator />

        <div className="space-y-4">
          <FormRow id="githubUrl" label="GitHub URL">
            <Input id="githubUrl" type="url" ref={githubUrlRef} className="font-mono text-xs" />
          </FormRow>
          <FormRow id="siteUrl" label="サイト URL">
            <Input id="siteUrl" type="url" ref={siteUrlRef} className="font-mono text-xs" />
          </FormRow>
          <FormRow id="lpSiteUrl" label="LP URL">
            <Input id="lpSiteUrl" type="url" ref={lpSiteUrlRef} className="font-mono text-xs" />
          </FormRow>
          <FormRow id="thumbnail" label="サムネイル URL">
            <Input id="thumbnail" type="url" ref={thumbnailRef} className="font-mono text-xs" />
          </FormRow>
          <FormRow id="miniThumbnail" label="ミニサムネイル URL">
            <Input
              id="miniThumbnail"
              type="url"
              ref={miniThumbnailRef}
              className="font-mono text-xs"
            />
          </FormRow>
        </div>

        <FormActions
          pending={createMutation.isPending}
          submitLabel="登録する"
          pendingLabel="登録中..."
          backHref={BACK}
        />
      </form>
    </FormPage>
  );
};

export default Page;
