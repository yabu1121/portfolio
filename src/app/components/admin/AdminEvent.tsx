'use client'

import { api } from "@/trpc/client"
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../common/Error";
import { DataTable, buildSections, type Column } from "./ui/DataTable";
import { ListHeader } from "./ui/ListHeader";
import { DeleteButton, EditButton } from "./ui/RowActions";
import { Mono } from "./ui/display";

type EventRow = {
  id: string;
  year: number;
  month: number;
  name: string;
};

const AdminEvent = () => {
  const utils = api.useUtils();
  const { data, isLoading, error } = api.event.getAll.useQuery();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");

  const deleteMutation = api.event.delete.useMutation({
    onSuccess: async () => {
      toast.success("削除しました");
      await utils.event.getAll.invalidate();
    },
    onError: (e) => toast.error("削除に失敗しました", { description: e.message }),
  });

  const events = useMemo(() => (data ?? []) as EventRow[], [data]);

  /* 参加履歴は種別を持たないので、年で分別する */
  const options = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of events) {
      const k = String(e.year);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return [...counts.keys()]
      .sort((a, b) => Number(b) - Number(a))
      .map((value) => ({ value, label: `${value}年`, count: counts.get(value)! }));
  }, [events]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (kind && String(e.year) !== kind) return false;
      if (!q) return true;
      return [e.name, `${e.year}`, `${e.year}.${e.month}`].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [events, query, kind]);

  const sections = useMemo(
    () =>
      buildSections(
        rows,
        (e) => String(e.year),
        (k) => `${k}年`,
        options.map((o) => o.value)
      ),
    [rows, options]
  );

  const columns: Column<EventRow>[] = [
    {
      key: "date",
      header: "年月",
      className: "w-28",
      mobile: "meta",
      /* 縦に並べて読むので、ゼロ埋めして桁を揃える */
      render: (e) => <Mono>{`${e.year}.${String(e.month).padStart(2, "0")}`}</Mono>,
    },
    {
      key: "name",
      header: "イベント",
      className: "w-auto",
      mobile: "primary",
      render: (e) => <span className="font-medium">{e.name}</span>,
    },
  ];

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error) return <Error error={error} />;

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0">
      <ListHeader
        title="参加履歴"
        shown={rows.length}
        total={events.length}
        search={{ value: query, onChange: setQuery, placeholder: "イベント名・年" }}
        filter={{ value: kind, onChange: setKind, options }}
        createHref="/admin/event/create"
      />
      <DataTable
        columns={columns}
        sections={sections}
        getKey={(e) => e.id}
        emptyMessage={
          query || kind
            ? "条件に一致する参加履歴がありません"
            : "参加履歴がまだありません"
        }
        emptyHint={
          query || kind ? "絞り込みを解除するには Esc" : "「新規作成」から追加できます"
        }
        actions={(e) => (
          <>
            <EditButton href={`/admin/event/edit/${e.id}`} />
            <DeleteButton
              name={e.name}
              description="この参加履歴を削除しますか？"
              pending={deleteMutation.isPending}
              onConfirm={() => deleteMutation.mutate({ id: e.id })}
            />
          </>
        )}
      />
    </Card>
  );
};

export default AdminEvent;
