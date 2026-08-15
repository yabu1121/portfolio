'use client'

import { api } from "@/trpc/client"
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../common/Error";
import {
  TECH_KINDS,
  TECH_KIND_LABEL,
  isLanguage,
  type TechKind,
} from "@/app/utils/techKind";
import { DataTable, buildSections, type Column } from "./ui/DataTable";
import { ListHeader } from "./ui/ListHeader";
import { EditButton } from "./ui/RowActions";
import { Clamp3, IconCell } from "./ui/display";

type Tech = {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  kind: string;
};

const kindLabel = (k: string) => TECH_KIND_LABEL[k as TechKind] ?? k;

const AdminTech = () => {
  const { data, isLoading, error } = api.tech.getAll.useQuery();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");

  const techs = useMemo(() => (data ?? []) as Tech[], [data]);

  const options = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of techs) counts.set(t.kind, (counts.get(t.kind) ?? 0) + 1);
    // 種別は定義順（言語 → フレームワーク → …）で並べる
    const ordered = [...TECH_KINDS].filter((k) => counts.has(k));
    const rest = [...counts.keys()].filter(
      (k) => !(TECH_KINDS as readonly string[]).includes(k)
    );
    return [...ordered, ...rest].map((value) => ({
      value,
      label: kindLabel(value),
      count: counts.get(value)!,
    }));
  }, [techs]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return techs.filter((t) => {
      if (kind && t.kind !== kind) return false;
      if (!q) return true;
      return [t.name, t.description ?? "", kindLabel(t.kind)].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [techs, query, kind]);

  const sections = useMemo(
    () => buildSections(rows, (t) => t.kind, kindLabel, [...TECH_KINDS]),
    [rows]
  );

  const columns: Column<Tech>[] = [
    {
      key: "name",
      header: "技術",
      className: "w-40 sm:w-56",
      mobile: "primary",
      render: (t) => (
        <span className="flex items-center gap-2.5">
          <IconCell src={t.iconUrl} name={t.name} />
          <span className="truncate font-semibold">{t.name}</span>
        </span>
      ),
    },
    {
      key: "kind",
      header: "種別",
      className: "hidden w-40 lg:table-cell",
      mobile: "meta",
      render: (t) => (
        <Badge
          variant={isLanguage(t.kind) ? "default" : "secondary"}
          className="font-mono text-[10px]"
        >
          {kindLabel(t.kind)}
        </Badge>
      ),
    },
    {
      key: "description",
      header: "説明",
      className: "hidden w-auto md:table-cell",
      mobile: "detail",
      render: (t) => <Clamp3>{t.description ?? ""}</Clamp3>,
    },
  ];

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error) return <Error error={error} />;

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0">
      {/* tech ルーターに delete が無いので、削除だけ提供できない */}
      <ListHeader
        title="技術"
        shown={rows.length}
        total={techs.length}
        search={{ value: query, onChange: setQuery, placeholder: "技術名・種別" }}
        filter={{ value: kind, onChange: setKind, options }}
        createHref="/admin/tech/create"
        createLabel="技術を追加"
        note="削除は未対応"
      />
      <DataTable
        columns={columns}
        sections={sections}
        getKey={(t) => t.id}
        emptyMessage={
          query || kind ? "条件に一致する技術がありません" : "技術がまだ登録されていません"
        }
        emptyHint={query || kind ? "絞り込みを解除するには Esc" : undefined}
        actions={(t) => <EditButton href={`/admin/tech/edit/${t.id}`} />}
      />
    </Card>
  );
};

export default AdminTech;
