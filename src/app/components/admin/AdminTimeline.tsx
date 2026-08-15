'use client'

import { api } from "@/trpc/client"
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../common/Error";
import {
  formatTimelinePeriod,
  getTimelinePeriodKind,
  type TimelinePeriodInput,
} from "@/app/utils/timelineDate";
import { DataTable, buildSections, type Column } from "./ui/DataTable";
import { ListHeader } from "./ui/ListHeader";
import { DeleteButton, EditButton } from "./ui/RowActions";
import { Dash, Mono } from "./ui/display";

type TimelineRow = TimelinePeriodInput & {
  id: string;
  category: string;
  title: string;
  detail: string;
  urls?: string[] | null;
};

const UNCATEGORIZED = "__none__";
const categoryKey = (i: TimelineRow) => i.category?.trim() || UNCATEGORIZED;
const categoryLabel = (k: string) => (k === UNCATEGORIZED ? "分類なし" : k);

const AdminTimeline = () => {
  const utils = api.useUtils();
  const { data, isLoading, error } = api.timeline.getAll.useQuery();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");

  const deleteMutation = api.timeline.delete.useMutation({
    onSuccess: async () => {
      toast.success("削除しました");
      await utils.timeline.getAll.invalidate();
    },
    onError: (e) => toast.error("削除に失敗しました", { description: e.message }),
  });

  const items = useMemo(() => (data ?? []) as unknown as TimelineRow[], [data]);

  const options = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of items) {
      const k = categoryKey(i);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, label: categoryLabel(value), count }));
  }, [items]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (kind && categoryKey(i) !== kind) return false;
      if (!q) return true;
      return [i.title, i.detail ?? "", i.category, formatTimelinePeriod(i)].some(
        (v) => v.toLowerCase().includes(q)
      );
    });
  }, [items, query, kind]);

  const sections = useMemo(
    () =>
      buildSections(
        rows,
        categoryKey,
        categoryLabel,
        options.map((o) => o.value)
      ),
    [rows, options]
  );

  const columns: Column<TimelineRow>[] = [
    {
      key: "period",
      header: "期間",
      className: "w-32 sm:w-48",
      mobile: "meta",
      render: (i) => (
        <span className="flex items-center gap-1.5">
          <Mono>{formatTimelinePeriod(i)}</Mono>
          {getTimelinePeriodKind(i) === "ongoing" ? (
            <Badge className="px-1.5 py-0 font-mono text-[10px]">継続</Badge>
          ) : null}
        </span>
      ),
    },
    {
      key: "title",
      header: "タイトル",
      className: "w-auto",
      mobile: "primary",
      render: (i) => (
        <span className="block">
          <span className="block truncate font-semibold">{i.title}</span>
          {i.detail ? (
            <span className="mt-0.5 line-clamp-3 min-h-[3.66rem] text-xs leading-relaxed text-muted-foreground">
              {i.detail}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      key: "urls",
      header: "リンク",
      className: "hidden w-16 text-center md:table-cell",
      mobile: "meta",
      render: (i) =>
        i.urls && i.urls.length > 0 ? <Mono>{i.urls.length}</Mono> : <Dash />,
    },
  ];

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error) return <Error error={error} />;

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0">
      <ListHeader
        title="経歴"
        shown={rows.length}
        total={items.length}
        search={{ value: query, onChange: setQuery, placeholder: "タイトル・期間" }}
        filter={{ value: kind, onChange: setKind, options }}
        createHref="/admin/timeline/create"
      />
      <DataTable
        columns={columns}
        sections={sections}
        getKey={(i) => i.id}
        emptyMessage={
          query || kind ? "条件に一致する経歴がありません" : "経歴がまだありません"
        }
        emptyHint={
          query || kind ? "絞り込みを解除するには Esc" : "「新規作成」から追加できます"
        }
        actions={(i) => (
          <>
            <EditButton href={`/admin/timeline/edit/${i.id}`} />
            <DeleteButton
              name={i.title}
              description="この経歴を削除しますか？"
              pending={deleteMutation.isPending}
              onConfirm={() => deleteMutation.mutate({ id: i.id })}
            />
          </>
        )}
      />
    </Card>
  );
};

export default AdminTimeline;
