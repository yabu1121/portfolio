'use client'

import { api } from "@/trpc/client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { FormActions, FormPage } from "@/app/components/admin/ui/FormPage";
import {
  TimelineFields,
  readTimelineForm,
} from "@/app/components/admin/ui/TimelineFields";

const BACK = "/admin?tab=timeline";

const Page = () => {
  const router = useRouter();
  const utils = api.useUtils();

  // 継続中のときは終了日の入力欄を無効化するので state で持つ
  const [isOngoing, setIsOngoing] = useState(false);

  const { data: items } = api.timeline.getAll.useQuery();
  const categories = [
    ...new Set(
      (items ?? [])
        .map((i) => (i as { category?: string }).category)
        .filter(Boolean)
    ),
  ] as string[];

  const createMutation = api.timeline.create.useMutation({
    onSuccess: async () => {
      toast.success("登録しました");
      await utils.timeline.getAll.invalidate();
      router.push(BACK);
    },
    onError: (e) => toast.error("登録に失敗しました", { description: e.message }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = readTimelineForm(e.currentTarget);
    createMutation.mutate({
      ...v,
      endYear: isOngoing || !v.endYear ? null : v.endYear,
      endMonth: isOngoing ? null : v.endMonth,
      endDay: isOngoing ? null : v.endDay,
      isOngoing,
    });
  };

  const now = new Date();

  return (
    <FormPage title="経歴を追加" backHref={BACK}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <TimelineFields
          defaults={{ year: String(now.getFullYear()), month: now.getMonth() + 1 }}
          isOngoing={isOngoing}
          setIsOngoing={setIsOngoing}
          categories={categories}
        />
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
