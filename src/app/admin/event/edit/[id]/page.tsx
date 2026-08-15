'use client'

import { api } from "@/trpc/client"
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FormActions,
  FormPage,
  FormRow,
} from "@/app/components/admin/ui/FormPage";

const BACK = "/admin?tab=event";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();

  const { data, isLoading } = api.event.getByID.useQuery({ id });

  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const updateMutation = api.event.update.useMutation({
    onSuccess: async () => {
      toast.success("更新しました");
      await utils.event.getAll.invalidate();
      await utils.event.getByID.invalidate({ id });
      router.push(BACK);
    },
    onError: (e) => toast.error("更新に失敗しました", { description: e.message }),
  });

  if (isLoading) return <Skeleton className="h-72 w-full max-w-3xl" />;
  if (!data)
    return (
      <FormPage title="参加履歴を編集" backHref={BACK}>
        <p className="text-sm text-muted-foreground">
          この参加履歴は見つかりませんでした。削除された可能性があります。
        </p>
      </FormPage>
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id,
      year: Number(yearRef.current?.value ?? 0),
      month: Number(monthRef.current?.value ?? 0),
      name: nameRef.current?.value ?? "",
    });
  };

  return (
    <FormPage title="参加履歴を編集" backHref={BACK} description={data.name}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:max-w-xs">
          <FormRow id="year" label="年" required>
            <Input
              id="year"
              type="number"
              ref={yearRef}
              defaultValue={data.year}
              className="font-mono tabular-nums"
              required
            />
          </FormRow>
          <FormRow id="month" label="月" required>
            <Input
              id="month"
              type="number"
              ref={monthRef}
              min={1}
              max={12}
              defaultValue={data.month}
              className="font-mono tabular-nums"
              required
            />
          </FormRow>
        </div>

        <FormRow id="name" label="イベント名" required>
          <Input
            id="name"
            type="text"
            ref={nameRef}
            defaultValue={data.name}
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
