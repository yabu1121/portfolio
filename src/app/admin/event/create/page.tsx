'use client'

import { api } from "@/trpc/client"
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  FormActions,
  FormPage,
  FormRow,
} from "@/app/components/admin/ui/FormPage";

const BACK = "/admin?tab=event";

const Page = () => {
  const router = useRouter();
  const utils = api.useUtils();

  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const createMutation = api.event.create.useMutation({
    onSuccess: async () => {
      toast.success("登録しました");
      await utils.event.getAll.invalidate();
      router.push(BACK);
    },
    onError: (e) => toast.error("登録に失敗しました", { description: e.message }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      year: Number(yearRef.current?.value ?? 0),
      month: Number(monthRef.current?.value ?? 0),
      name: nameRef.current?.value ?? "",
    });
  };

  return (
    <FormPage title="参加履歴を追加" backHref={BACK}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:max-w-xs">
          <FormRow id="year" label="年" required>
            <Input
              id="year"
              type="number"
              ref={yearRef}
              defaultValue={new Date().getFullYear()}
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
              defaultValue={new Date().getMonth() + 1}
              className="font-mono tabular-nums"
              required
            />
          </FormRow>
        </div>

        <FormRow id="name" label="イベント名" required>
          <Input id="name" type="text" ref={nameRef} required />
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
