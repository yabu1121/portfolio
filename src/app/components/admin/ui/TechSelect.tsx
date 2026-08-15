'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TECH_KINDS,
  TECH_KIND_LABEL,
  type TechKind,
} from "@/app/utils/techKind";

type Tech = { id: string; name: string; kind: string };

/**
 * 技術の選択。数が多い（30件超）ので、種別ごとに見出しを付けて分ける。
 * 素の <select> だと全件が一列に並んで探しにくい。
 */
export const TechSelect = ({
  id,
  techs,
  value,
  onChange,
}: {
  id: string;
  techs: Tech[];
  value: string;
  onChange: (v: string) => void;
}) => {
  const groups = [...TECH_KINDS, ...new Set(techs.map((t) => t.kind))]
    .filter((k, i, arr) => arr.indexOf(k) === i)
    .map((kind) => ({
      kind,
      label: TECH_KIND_LABEL[kind as TechKind] ?? kind,
      items: techs.filter((t) => t.kind === kind),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <Select value={value} onValueChange={onChange} required>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder="技術を選択してください" />
      </SelectTrigger>
      <SelectContent>
        {groups.map((g) => (
          <SelectGroup key={g.kind}>
            <SelectLabel className="font-mono text-[10px] tracking-[0.14em] uppercase">
              {g.label}
            </SelectLabel>
            {g.items.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};
