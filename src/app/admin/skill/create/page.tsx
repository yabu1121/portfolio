'use client'

import { api } from "@/trpc/client"
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const utils = api.useUtils();

  const { data: techs, isLoading } = api.tech.getAll.useQuery();

  const [techId, setTechId] = useState("");
  const [level, setLevel] = useState(30);
  const [description, setDescription] = useState("");

  const createMutation = api.skill.create.useMutation({
    onSuccess: async () => {
      toast.success("登録しました");
      await utils.skill.getAll.invalidate();
      router.push(BACK);
    },
    onError: (e) => toast.error("登録に失敗しました", { description: e.message }),
  });

  if (isLoading) return <Skeleton className="h-96 w-full max-w-3xl" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techId) {
      toast.error("技術を選択してください");
      return;
    }
    createMutation.mutate({ techId, level, description });
  };

  return (
    <FormPage
      title="スキルを追加"
      backHref={BACK}
      description="登録済みの技術に、自分の理解度と補足を紐付けます"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormRow id="techId" label="技術" required>
          <TechSelect
            id="techId"
            techs={techs ?? []}
            value={techId}
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
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-24 font-mono tabular-nums"
              required
            />
            <LevelBar level={level} />
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormRow>

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
