'use client'

import { api } from "@/trpc/client"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FormActions, FormPage } from "@/app/components/admin/ui/FormPage";
import {
  TimelineFields,
  readTimelineForm,
} from "@/app/components/admin/ui/TimelineFields";

const BACK = "/admin?tab=timeline";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();

  const { data, isLoading } = api.timeline.getByID.useQuery({ id });
  const { data: items } = api.timeline.getAll.useQuery();

  // 継続中の初期値はデータ到着後に確定するため、null を「未変更」として扱う
  const [ongoingOverride, setOngoingOverride] = useState<boolean | null>(null);

  const updateMutation = api.timeline.update.useMutation({
    onSuccess: async () => {
      toast.success("更新しました");
      await utils.timeline.getAll.invalidate();
      await utils.timeline.getByID.invalidate({ id });
      router.push(BACK);
    },
    onError: (e) => toast.error("更新に失敗しました", { description: e.message }),
  });

  if (isLoading) return <Skeleton className="h-[40rem] w-full max-w-3xl" />;
  if (!data)
    return (
      <FormPage title="経歴を編集" backHref={BACK}>
        <p className="text-sm text-muted-foreground">
          この経歴は見つかりませんでした。削除された可能性があります。
        </p>
      </FormPage>
    );

  const isOngoing = ongoingOverride ?? !!data.isOngoing;

  const categories = [
    ...new Set(
      (items ?? [])
        .map((i) => (i as { category?: string }).category)
        .filter(Boolean)
    ),
  ] as string[];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = readTimelineForm(e.currentTarget);
    updateMutation.mutate({
      id,
      ...v,
      endYear: isOngoing || !v.endYear ? null : v.endYear,
      endMonth: isOngoing ? null : v.endMonth,
      endDay: isOngoing ? null : v.endDay,
      isOngoing,
    });
  };

  return (
    <FormPage title="経歴を編集" backHref={BACK} description={data.title}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <TimelineFields
          defaults={{
            year: data.year,
            month: data.month,
            day: data.day,
            endYear: data.endYear,
            endMonth: data.endMonth,
            endDay: data.endDay,
            category: data.category,
            title: data.title,
            detail: data.detail,
            urls: data.urls,
          }}
          isOngoing={isOngoing}
          setIsOngoing={setOngoingOverride}
          categories={categories}
        />
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
