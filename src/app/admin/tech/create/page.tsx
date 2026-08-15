'use client'

import { api } from "@/trpc/client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TECH_KINDS,
  TECH_KIND_LABEL,
  type TechKind,
} from "@/app/utils/techKind";
import {
  FormActions,
  FormPage,
  FormRow,
} from "@/app/components/admin/ui/FormPage";

const BACK = "/admin?tab=tech";

const Page = () => {
  const router = useRouter();
  const utils = api.useUtils();

  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [kind, setKind] = useState<TechKind>("library");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const createMutation = api.tech.create.useMutation({
    onSuccess: async () => {
      toast.success("技術を追加しました");
      await utils.tech.getAll.invalidate();
      router.push(BACK);
    },
    onError: (e) => toast.error("追加に失敗しました", { description: e.message }),
  });

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message ?? "upload failed");
    return json.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const file = fileRef.current?.files?.[0];
      const iconUrl = file ? await uploadImage(file) : null;
      await createMutation.mutateAsync({
        name: nameRef.current?.value ?? "",
        description: descRef.current?.value || null,
        iconUrl,
        kind,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormPage
      title="技術を追加"
      backHref={BACK}
      description="ここで追加した技術を、プロジェクトやスキルに紐付けられます"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormRow id="name" label="技術名" required>
          <Input id="name" type="text" ref={nameRef} placeholder="例: Go" required />
        </FormRow>

        <FormRow
          id="kind"
          label="種別"
          hint="「言語」を選ぶと About ページで理解度バーが表示されます"
          required
        >
          <Select value={kind} onValueChange={(v) => setKind(v as TechKind)}>
            <SelectTrigger id="kind" className="w-full sm:w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TECH_KINDS.map((k) => (
                <SelectItem key={k} value={k}>
                  {TECH_KIND_LABEL[k]}
                  <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
                    {k}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormRow>

        <FormRow id="desc" label="説明" hint="一覧に表示される短い説明">
          <Textarea
            id="desc"
            ref={descRef}
            rows={3}
            placeholder="例: Googleが開発した言語。シンプルで習得しやすく、並行処理が得意"
          />
        </FormRow>

        <FormRow
          id="icon"
          label="アイコン"
          hint="任意。png / jpeg / webp / svg、2MB以下"
        >
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 object-contain"
                  unoptimized
                />
              ) : (
                <span aria-hidden className="font-mono text-xs text-muted-foreground">
                  ―
                </span>
              )}
            </span>
            <Input
              id="icon"
              type="file"
              ref={fileRef}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
              className="cursor-pointer file:mr-3 file:cursor-pointer file:text-xs"
            />
          </div>
        </FormRow>

        <FormActions
          pending={submitting}
          submitLabel="追加する"
          pendingLabel="追加中..."
          backHref={BACK}
        />
      </form>
    </FormPage>
  );
};

export default Page;
