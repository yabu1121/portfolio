'use client'

import { api } from "@/trpc/client"
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
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
import { IconCell } from "@/app/components/admin/ui/display";

const BACK = "/admin?tab=projects";
const WIDTH = "max-w-4xl";

type TechLink = { techId: string; description: string };

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const utils = api.useUtils();

  const { data, isLoading } = api.work.getByID.useQuery({ id });
  const { data: allTechs } = api.tech.getAll.useQuery();
  const { data: works } = api.work.getAll.useQuery();

  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const githubUrlRef = useRef<HTMLInputElement>(null);
  const lpSiteUrlRef = useRef<HTMLInputElement>(null);
  const siteUrlRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const miniThumbnailRef = useRef<HTMLInputElement>(null);

  // 技術スタックの紐付け状態（techId + 使用理由）。data 読み込み時に一度だけ初期化
  const [links, setLinks] = useState<TechLink[]>([]);
  const [initedFor, setInitedFor] = useState<string | null>(null);
  if (data && initedFor !== id) {
    const wtt =
      (data as { worksToTechs?: { techId: string; description: string | null }[] })
        .worksToTechs ?? [];
    setInitedFor(id);
    setLinks(wtt.map((w) => ({ techId: w.techId, description: w.description ?? "" })));
  }

  const isLinked = (techId: string) => links.some((l) => l.techId === techId);
  const toggle = (techId: string) =>
    setLinks((prev) =>
      prev.some((l) => l.techId === techId)
        ? prev.filter((l) => l.techId !== techId)
        : [...prev, { techId, description: "" }]
    );
  const setDesc = (techId: string, description: string) =>
    setLinks((prev) =>
      prev.map((l) => (l.techId === techId ? { ...l, description } : l))
    );

  const updateMutation = api.work.update.useMutation({
    onSuccess: async () => {
      toast.success("基本情報を更新しました");
      await utils.work.getAll.invalidate();
      await utils.work.getByID.invalidate({ id });
    },
    onError: (e) => toast.error("更新に失敗しました", { description: e.message }),
  });

  const setTechsMutation = api.work.setTechs.useMutation({
    onSuccess: async () => {
      toast.success("使用技術を保存しました");
      await utils.work.getByID.invalidate({ id });
      await utils.work.getAll.invalidate();
    },
    onError: (e) => toast.error("保存に失敗しました", { description: e.message }),
  });

  if (isLoading) return <Skeleton className={`h-[36rem] w-full ${WIDTH}`} />;
  if (!data)
    return (
      <FormPage title="プロジェクトを編集" backHref={BACK} className={WIDTH}>
        <p className="text-sm text-muted-foreground">
          このプロジェクトは見つかりませんでした。削除された可能性があります。
        </p>
      </FormPage>
    );

  const categories = [
    ...new Set((works ?? []).map((w) => w.category).filter(Boolean)),
  ] as string[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id,
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

  /* 技術は30件を超えるので、種別ごとに分けて出す。
     以前は名前順のフラットな格子で、目的の技術を探しにくかった。 */
  const techGroups = [
    ...TECH_KINDS,
    ...new Set((allTechs ?? []).map((t) => t.kind)),
  ]
    .filter((k, i, arr) => arr.indexOf(k) === i)
    .map((kind) => ({
      kind,
      label: TECH_KIND_LABEL[kind as TechKind] ?? kind,
      items: (allTechs ?? [])
        .filter((t) => t.kind === kind)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      <FormPage
        title="プロジェクトを編集"
        backHref={BACK}
        description={data.title}
        className={WIDTH}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormRow id="title" label="タイトル" required>
            <Input id="title" type="text" ref={titleRef} defaultValue={data.title} required />
          </FormRow>

          <FormRow
            id="description"
            label="説明"
            hint="Markdown 可（## 見出し / - 箇条書き / **強調** / ```コード```）"
            required
          >
            <Textarea
              id="description"
              ref={descRef}
              rows={12}
              defaultValue={data.description}
              className="font-mono text-xs"
              required
            />
          </FormRow>

          <FormRow id="category" label="分類" hint="既存の分類から選ぶか、新しく入力します">
            <Input
              id="category"
              type="text"
              ref={categoryRef}
              defaultValue={data.category ?? ""}
              list="work-categories"
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
              <Input
                id="githubUrl"
                type="url"
                ref={githubUrlRef}
                defaultValue={data.githubUrl ?? ""}
                className="font-mono text-xs"
              />
            </FormRow>
            <FormRow id="siteUrl" label="サイト URL">
              <Input
                id="siteUrl"
                type="url"
                ref={siteUrlRef}
                defaultValue={data.siteUrl ?? ""}
                className="font-mono text-xs"
              />
            </FormRow>
            <FormRow id="lpSiteUrl" label="LP URL">
              <Input
                id="lpSiteUrl"
                type="url"
                ref={lpSiteUrlRef}
                defaultValue={data.lpSiteUrl ?? ""}
                className="font-mono text-xs"
              />
            </FormRow>
            <FormRow id="thumbnail" label="サムネイル URL">
              <Input
                id="thumbnail"
                type="url"
                ref={thumbnailRef}
                defaultValue={data.thumbnail ?? ""}
                className="font-mono text-xs"
              />
            </FormRow>
            <FormRow id="miniThumbnail" label="ミニサムネイル URL">
              <Input
                id="miniThumbnail"
                type="url"
                ref={miniThumbnailRef}
                defaultValue={data.miniThumbnail ?? ""}
                className="font-mono text-xs"
              />
            </FormRow>
          </div>

          <FormActions
            pending={updateMutation.isPending}
            submitLabel="基本情報を更新"
            pendingLabel="更新中..."
            backHref={BACK}
          />
        </form>
      </FormPage>

      <Card className={WIDTH}>
        <CardHeader className="flex-row flex-wrap items-center gap-2 space-y-0">
          <CardTitle className="text-sm">使用技術</CardTitle>
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {links.length} 件を選択中
          </span>
          <Button asChild variant="outline" size="sm" className="ml-auto h-8">
            <Link href="/admin/tech/create">
              <Plus className="size-3.5" />
              技術を追加
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            使う技術を選び、それぞれに「この作品で何にどう使ったか」を書けます。
            入力内容は作品の詳細ページに表示されます。選択後に「使用技術を保存」を押してください。
          </p>

          {techGroups.map((group) => (
            <section key={group.kind} className="space-y-2">
              <h3 className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                {group.label}
                <span className="ml-1.5 tabular-nums">{group.items.length}</span>
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {group.items.map((tech) => {
                  const linked = isLinked(tech.id);
                  const link = links.find((l) => l.techId === tech.id);
                  return (
                    <div
                      key={tech.id}
                      className={`rounded-lg border p-3 transition-colors ${
                        linked ? "border-primary/60 bg-primary/5" : "bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Checkbox
                          id={`tech-${tech.id}`}
                          checked={linked}
                          onCheckedChange={() => toggle(tech.id)}
                        />
                        <IconCell src={tech.iconUrl} name={tech.name} />
                        <Label
                          htmlFor={`tech-${tech.id}`}
                          className="cursor-pointer text-sm font-semibold"
                        >
                          {tech.name}
                        </Label>
                      </div>
                      {linked ? (
                        <Textarea
                          value={link?.description ?? ""}
                          onChange={(e) => setDesc(tech.id, e.target.value)}
                          rows={2}
                          placeholder="使用理由・使い方（例：並列処理と高速性を重視して採用）"
                          className="mt-2 text-xs"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <div className="flex items-center gap-2 border-t pt-4">
            <Button
              type="button"
              onClick={() =>
                setTechsMutation.mutate({
                  workId: id,
                  techs: links.map((l) => ({
                    techId: l.techId,
                    description: l.description || null,
                  })),
                })
              }
              disabled={setTechsMutation.isPending}
            >
              {setTechsMutation.isPending ? "保存中..." : "使用技術を保存"}
            </Button>
            <span className="text-[11px] text-muted-foreground">
              基本情報とは別に保存されます
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
