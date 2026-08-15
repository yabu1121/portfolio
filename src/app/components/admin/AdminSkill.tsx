'use client'

import { api } from "@/trpc/client"
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../common/Error";
import {
  TECH_KINDS,
  TECH_KIND_LABEL,
  type TechKind,
} from "@/app/utils/techKind";
import { DataTable, buildSections, type Column } from "./ui/DataTable";
import { ListHeader } from "./ui/ListHeader";
import { DeleteButton, EditButton } from "./ui/RowActions";
import { Clamp3, IconCell, LevelBar } from "./ui/display";

type Skill = {
  id: string;
  name: string;
  level: number;
  description: string | null;
  iconUrl: string | null;
  kind: string;
};

const kindLabel = (k: string) => TECH_KIND_LABEL[k as TechKind] ?? k;

const AdminSkill = () => {
  const utils = api.useUtils();
  const { data, isLoading, error } = api.skill.getAll.useQuery();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");

  const deleteMutation = api.skill.delete.useMutation({
    onSuccess: async () => {
      toast.success("削除しました");
      await utils.skill.getAll.invalidate();
    },
    onError: (e) => toast.error("削除に失敗しました", { description: e.message }),
  });

  const skills = useMemo(() => (data ?? []) as Skill[], [data]);

  const options = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of skills) counts.set(s.kind, (counts.get(s.kind) ?? 0) + 1);
    const ordered = [...TECH_KINDS].filter((k) => counts.has(k));
    const rest = [...counts.keys()].filter(
      (k) => !(TECH_KINDS as readonly string[]).includes(k)
    );
    return [...ordered, ...rest].map((value) => ({
      value,
      label: kindLabel(value),
      count: counts.get(value)!,
    }));
  }, [skills]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      if (kind && s.kind !== kind) return false;
      if (!q) return true;
      return [s.name, s.description ?? "", kindLabel(s.kind)].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [skills, query, kind]);

  const sections = useMemo(
    () => buildSections(rows, (s) => s.kind, kindLabel, [...TECH_KINDS]),
    [rows]
  );

  const columns: Column<Skill>[] = [
    {
      key: "name",
      header: "スキル",
      className: "w-40 sm:w-56",
      mobile: "primary",
      render: (s) => (
        <span className="flex items-center gap-2.5">
          <IconCell src={s.iconUrl} name={s.name} />
          <span className="truncate font-semibold">{s.name}</span>
        </span>
      ),
    },
    {
      key: "level",
      header: "理解度",
      className: "hidden w-32 sm:table-cell",
      mobile: "meta",
      render: (s) => <LevelBar level={s.level} />,
    },
    {
      key: "description",
      header: "補足",
      className: "hidden w-auto md:table-cell",
      mobile: "detail",
      render: (s) => <Clamp3>{s.description ?? ""}</Clamp3>,
    },
  ];

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error) return <Error error={error} />;

  return (
    <Card className="flex h-full flex-col gap-0 overflow-hidden py-0">
      <ListHeader
        title="スキル"
        shown={rows.length}
        total={skills.length}
        search={{ value: query, onChange: setQuery, placeholder: "スキル名・補足" }}
        filter={{ value: kind, onChange: setKind, options }}
        createHref="/admin/skill/create"
      />
      <DataTable
        columns={columns}
        sections={sections}
        getKey={(s) => s.id}
        emptyMessage={
          query || kind ? "条件に一致するスキルがありません" : "スキルがまだありません"
        }
        emptyHint={
          query || kind ? "絞り込みを解除するには Esc" : "「新規作成」から追加できます"
        }
        actions={(s) => (
          <>
            <EditButton href={`/admin/skill/edit/${s.id}`} />
            <DeleteButton
              name={s.name}
              description="このスキルを削除しますか？"
              pending={deleteMutation.isPending}
              onConfirm={() => deleteMutation.mutate({ id: s.id })}
            />
          </>
        )}
      />
    </Card>
  );
};

export default AdminSkill;
