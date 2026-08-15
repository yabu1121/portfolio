'use client'

import { api } from "@/trpc/client"
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../common/Error";
import { DataTable, buildSections, type Column } from "./ui/DataTable";
import { ListHeader } from "./ui/ListHeader";
import { DeleteButton, EditButton } from "./ui/RowActions";
import { Clamp3, Dash } from "./ui/display";

type Work = {
  id: string;
  title: string;
  description: string;
  category: string | null;
};

const UNCATEGORIZED = "__none__";
const categoryKey = (w: Work) => w.category?.trim() || UNCATEGORIZED;
const categoryLabel = (k: string) => (k === UNCATEGORIZED ? "分類なし" : k);

const AdminProject = () => {
  const utils = api.useUtils();
  const { data, isLoading, error } = api.work.getAll.useQuery();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");

  const deleteMutation = api.work.delete.useMutation({
    onSuccess: async () => {
      toast.success("削除しました");
      await utils.work.getAll.invalidate();
    },
    onError: (e) => toast.error("削除に失敗しました", { description: e.message }),
  });

  const works = useMemo(() => (data ?? []) as Work[], [data]);

  const options = useMemo(() => {
    const counts = new Map<string, number>();
    for (const w of works) {
      const k = categoryKey(w);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([value, count]) => ({ value, label: categoryLabel(value), count }));
  }, [works]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return works.filter((w) => {
      if (kind && categoryKey(w) !== kind) return false;
      if (!q) return true;
      return [w.title, w.description, w.category ?? ""].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [works, query, kind]);

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

  const columns: Column<Work>[] = [
    {
      key: "title",
      header: "タイトル",
      className: "w-40 max-w-40 sm:w-64 sm:max-w-64",
      mobile: "primary",
      render: (w) => (
        <span className="block truncate font-semibold" title={w.title}>
          {w.title}
        </span>
      ),
    },
    {
      key: "category",
      header: "分類",
      className: "hidden w-44 max-w-44 lg:table-cell",
      mobile: "meta",
      render: (w) =>
        w.category ? (
          <Badge variant="secondary" className="max-w-full truncate font-mono text-[10px]">
            {w.category}
          </Badge>
        ) : (
          <Dash />
        ),
    },
    {
      key: "description",
      header: "説明",
      className: "hidden w-auto md:table-cell",
      mobile: "detail",
      render: (w) => <Clamp3>{w.description}</Clamp3>,
    },
  ];

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error) return <Error error={error} />;

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0">
      <ListHeader
        title="プロジェクト"
        shown={rows.length}
        total={works.length}
        search={{ value: query, onChange: setQuery, placeholder: "タイトル・説明" }}
        filter={{ value: kind, onChange: setKind, options }}
        createHref="/admin/project/create"
      />
      <DataTable
        columns={columns}
        sections={sections}
        getKey={(w) => w.id}
        emptyMessage={
          query || kind
            ? "条件に一致するプロジェクトがありません"
            : "プロジェクトがまだありません"
        }
        emptyHint={
          query || kind ? "絞り込みを解除するには Esc" : "「新規作成」から追加できます"
        }
        actions={(w) => (
          <>
            <EditButton href={`/admin/project/edit/${w.id}`} />
            <DeleteButton
              name={w.title}
              description="このプロジェクトを削除しますか？"
              pending={deleteMutation.isPending}
              onConfirm={() => deleteMutation.mutate({ id: w.id })}
            />
          </>
        )}
      />
    </Card>
  );
};

export default AdminProject;
