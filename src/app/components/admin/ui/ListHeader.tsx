'use client'

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

/* Radix の Select は空文字の value を「未選択」として扱うため、
   「すべて」には別の値を割り当てて外側の空文字と変換する。 */
const ALL = "__all__";

/** 一覧が増えるほど効く。`/` でどこからでもフォーカスできる。 */
const SearchBox = ({
  value,
  onChange,
  placeholder = "絞り込み",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        ref.current?.focus();
      }
      if (e.key === "Escape" && el === ref.current) {
        onChange("");
        ref.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onChange]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-8 w-48 pr-7 pl-8 text-xs"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="絞り込みを解除"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer rounded p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground/50">
          /
        </kbd>
      )}
    </div>
  );
};

export type KindFilter = {
  /** 選択中の種別。空文字は「すべて」 */
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; count: number }[];
};

type ListHeaderProps = {
  title: string;
  shown: number;
  total: number;
  search?: { value: string; onChange: (v: string) => void; placeholder?: string };
  filter?: KindFilter;
  createHref?: string;
  createLabel?: string;
  /** 新規作成の導線が無い場合など、画面上に出す注記 */
  note?: string;
};

export const ListHeader = ({
  title,
  shown,
  total,
  search,
  filter,
  createHref,
  createLabel = "新規作成",
  note,
}: ListHeaderProps) => (
  <div className="flex shrink-0 flex-col gap-2.5 border-b p-3">
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <h2 className="text-sm font-semibold">{title}</h2>
      <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
        {shown === total ? total : `${shown} / ${total}`}
      </span>
      {note ? (
        <Badge variant="outline" className="text-[10px] font-normal">
          {note}
        </Badge>
      ) : null}

      <div className="ml-auto flex items-center gap-2">
        {search ? (
          <SearchBox
            value={search.value}
            onChange={search.onChange}
            placeholder={search.placeholder}
          />
        ) : null}
        {createHref ? (
          <Button asChild size="sm" className="h-8">
            <Link href={createHref}>
              <Plus className="size-3.5" />
              {createLabel}
            </Link>
          </Button>
        ) : null}
      </div>
    </div>

    {filter ? (
      <>
        {/* スマホ：チップだと3行に折り返して縦を食うので、1行のドロップダウンにする */}
        <Select
          value={filter.value || ALL}
          onValueChange={(v) => filter.onChange(v === ALL ? "" : v)}
        >
          <SelectTrigger
            size="sm"
            className="w-full text-xs sm:hidden"
            aria-label="種別で絞り込む"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>すべて（{total}）</SelectItem>
            {filter.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}（{o.count}）
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* タブレット以上：横に並べたチップ。1タップで切り替えられる */}
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          value={filter.value}
          onValueChange={(v) => filter.onChange(v ?? "")}
          className="hidden flex-wrap justify-start sm:flex"
        >
          <ToggleGroupItem value="" className="h-7 px-2.5 text-xs">
            すべて
            <span className="ml-1 font-mono text-[10px] text-muted-foreground tabular-nums">
              {total}
            </span>
          </ToggleGroupItem>
          {filter.options.map((o) => (
            <ToggleGroupItem
              key={o.value}
              value={o.value}
              className="h-7 px-2.5 text-xs"
            >
              {o.label}
              <span className="ml-1 font-mono text-[10px] text-muted-foreground tabular-nums">
                {o.count}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </>
    ) : null}
  </div>
);
