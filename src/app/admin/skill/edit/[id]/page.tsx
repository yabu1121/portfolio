'use client'

import { api } from "@/trpc/client"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  FormActions,
  FormPage,
  FormRow,
} from "@/app/components/admin/ui/FormPage";
import { TechSelect } from "@/app/components/admin/ui/TechSelect";
import { LevelBar } from "@/app/components/admin/ui/display";

const BACK = "/admin?tab=skill";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();

  const { data, isLoading } = api.skill.getByID.useQuery({ id });
  const { data: techs, isLoading: isTechsLoading } = api.tech.getAll.useQuery();

  /* getByID は join 済みの name を返し techId を持たないので、名前で突き合わせる */
  const currentTechId = techs?.find((t) => t.name === data?.name)?.id ?? "";

  const [techId, setTechId] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const updateMutation = api.skill.update.useMutation({
    onSuccess: async () => {
      toast.success("更新しました");
      await utils.skill.getAll.invalidate();
      await utils.skill.getByID.invalidate({ id });
      router.push(BACK);
    },
    onError: (e) => toast.error("更新に失敗しました", { description: e.message }),
  });

  if (isLoading || isTechsLoading)
    return <Skeleton className="h-96 w-full max-w-3xl" />;
  if (!data)
    return (
      <FormPage title="スキルを編集" backHref={BACK}>
        <p className="text-sm text-muted-foreground">
          このスキルは見つかりませんでした。削除された可能性があります。
        </p>
      </FormPage>
    );

  // 未編集のフィールドは取得値をそのまま使う
  const techValue = techId ?? currentTechId;
  const levelValue = level ?? data.level;
  const descValue = description ?? data.description ?? "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techValue) {
      toast.error("技術を選択してください");
      return;
    }
    updateMutation.mutate({
      id,
      techId: techValue,
      level: levelValue,
      description: descValue,
    });
  };

  return (
    <FormPage title="スキルを編集" backHref={BACK} description={data.name}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormRow id="techId" label="技術" required>
          <TechSelect
            id="techId"
            techs={techs ?? []}
            value={techValue}
            onChange={setTechId}
          />
        </FormRow>

        <FormRow id="level" label="理解度" hint="1〜100" required>
          <div className="flex items-center gap-4">
            <Input
              id="level"
              type="number"
              min={1}
              max={100}
              value={levelValue}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-24 font-mono tabular-nums"
              required
            />
            <LevelBar level={levelValue} />
          </div>
        </FormRow>

        <FormRow
          id="description"
          label="補足"
          hint="どこで何に使ったか。About ページに表示されます"
          required
        >
          <Textarea
            id="description"
            rows={4}
            value={descValue}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormRow>

        <FormActions
          pending={updateMutation.isPending}
          submitLabel="更新する"
          pendingLabel="更新中..."
          backHref={BACK}
        />
      </form>
    </FormPage>
  );
};

export default Page;
