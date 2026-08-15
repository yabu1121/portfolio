'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> = {
  key: string;
  header: string;
  /** 列幅・寄せをまとめて指定する（見出しセルと本体セルの両方に当たる） */
  className?: string;
  render: (row: T) => React.ReactNode;
  /**
   * スマホのカード表示での役割。
   * primary=見出し / meta=見出し下の小さな情報 / detail=本文 / hide=出さない。
   * 未指定は meta 扱い。
   */
  mobile?: "primary" | "meta" | "detail" | "hide";
};

/** 種別・分類でまとめた表示単位。label が null のときは見出しを出さない。 */
export type Section<T> = {
  key: string;
  label: string | null;
  rows: T[];
};

type DataTableProps<T> = {
  columns: Column<T>[];
  sections: Section<T>[];
  getKey: (row: T) => string;
  actions?: (row: T) => React.ReactNode;
  emptyMessage: string;
  emptyHint?: string;
};

const SectionLabel = ({ label, count }: { label: string; count: number }) => (
  <span className="flex items-center gap-2">
    <span className="font-mono text-[10px] tracking-[0.14em] uppercase">
      {label}
    </span>
    <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
      {count}
    </span>
  </span>
);

export function DataTable<T>({
  columns,
  sections,
  getKey,
  actions,
  emptyMessage,
  emptyHint,
}: DataTableProps<T>) {
  const total = sections.reduce((n, s) => n + s.rows.length, 0);
  const colCount = columns.length + (actions ? 1 : 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-1.5 px-6 py-16 text-center">
        <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
        {emptyHint ? (
          <p className="text-xs text-muted-foreground/70">{emptyHint}</p>
        ) : null}
      </div>
    );
  }

  const role = (c: Column<T>) => c.mobile ?? "meta";
  const primary = columns.find((c) => role(c) === "primary") ?? columns[0];
  const metas = columns.filter((c) => c !== primary && role(c) === "meta");
  const details = columns.filter((c) => role(c) === "detail");

  return (
    /* 横スクロールはさせない。縦だけこの中でスクロールし、ページ自体は動かさない。
       末尾の env(safe-area-inset-bottom) は iPhone のホームインジケータ避け。 */
    <div className="min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto pb-[env(safe-area-inset-bottom)]">
      {/* ── スマホ：テーブルだと列が入らないのでカードで縦に積む ── */}
      <ul className="divide-y md:hidden">
        {sections.flatMap((section) => [
          section.label !== null ? (
            <li
              key={`${section.key}-head`}
              className="sticky top-0 z-10 border-b bg-muted px-3 py-1.5"
            >
              <SectionLabel label={section.label} count={section.rows.length} />
            </li>
          ) : null,
          ...section.rows.map((row) => (
            <li key={getKey(row)} className="flex items-start gap-2 px-3 py-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="text-sm font-semibold">{primary.render(row)}</div>
                {metas.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {metas.map((c) => (
                      <span key={c.key} className="text-xs">
                        {c.render(row)}
                      </span>
                    ))}
                  </div>
                ) : null}
                {details.map((c) => (
                  <div key={c.key}>{c.render(row)}</div>
                ))}
              </div>
              {actions ? (
                <div className="flex shrink-0 items-center gap-0.5">
                  {actions(row)}
                </div>
              ) : null}
            </li>
          )),
        ])}
      </ul>

      {/* ── タブレット以上：テーブル ── */}
      <Table className="hidden table-fixed md:table">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {/* border-collapse では tr に sticky が効かないので、セル側に付ける */}
            {columns.map((c) => (
              <TableHead
                key={c.key}
                className={`sticky top-0 z-10 border-b bg-card font-mono text-[10px] tracking-[0.14em] whitespace-nowrap uppercase ${c.className ?? ""}`}
              >
                {c.header}
              </TableHead>
            ))}
            {actions ? (
              <TableHead className="sticky top-0 z-10 w-32 border-b bg-card text-right">
                <span className="sr-only">操作</span>
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>

        <TableBody>
          {sections.flatMap((section) => [
            section.label !== null && section.rows.length > 0 ? (
              /* 種別の区切り。件数まで出して、どこまでが同じ塊か分かるようにする */
              <TableRow
                key={`${section.key}-head`}
                className="border-y bg-muted hover:bg-muted"
              >
                <TableCell colSpan={colCount} className="py-1.5">
                  <SectionLabel label={section.label} count={section.rows.length} />
                </TableCell>
              </TableRow>
            ) : null,
            ...section.rows.map((row) => (
              <TableRow key={getKey(row)} className="group">
                {columns.map((c) => (
                  /* shadcn の TableCell は既定で whitespace-nowrap なので折り返せるよう
                     normal に戻す。説明が3行分あるため、縦位置は全列で上端に揃える。 */
                  <TableCell
                    key={c.key}
                    className={`overflow-hidden py-3 align-top whitespace-normal ${c.className ?? ""}`}
                  >
                    {c.render(row)}
                  </TableCell>
                ))}
                {actions ? (
                  <TableCell className="py-3 text-right align-top whitespace-nowrap">
                    {/* 通常は控えめに、行にカーソルが乗ったときだけはっきり出す */}
                    <span className="inline-flex items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      {actions(row)}
                    </span>
                  </TableCell>
                ) : null}
              </TableRow>
            )),
          ])}
        </TableBody>
      </Table>
    </div>
  );
}

/** 種別ごとに並べ替えてセクション化する。order に無いキーは末尾にまとめる。 */
export function buildSections<T>(
  rows: T[],
  keyOf: (row: T) => string,
  labelOf: (key: string) => string,
  order: string[]
): Section<T>[] {
  const buckets = new Map<string, T[]>();
  for (const row of rows) {
    const k = keyOf(row);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(row);
  }
  const known = order.filter((k) => buckets.has(k));
  const rest = [...buckets.keys()].filter((k) => !order.includes(k)).sort();
  return [...known, ...rest]
    .map((k) => ({ key: k, label: labelOf(k), rows: buckets.get(k)! }))
    .filter((s) => s.rows.length > 0);
}
