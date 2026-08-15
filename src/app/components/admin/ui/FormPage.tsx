'use client'

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

/**
 * 作成・編集ページの共通の枠。
 * 「戻る」の行き先を一覧のタブに固定して、保存せず離脱しても
 * 元のセクションに戻れるようにする（従来は router.back() 依存だった）。
 */
export const FormPage = ({
  title,
  backHref,
  description,
  className = "max-w-3xl",
  children,
}: {
  title: string;
  backHref: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <Card className={className}>
    <CardHeader className="flex-row items-center gap-2 space-y-0">
      <Button asChild variant="ghost" size="icon" className="-ml-1 size-8">
        <Link href={backHref} aria-label="一覧に戻る">
          <ArrowLeft className="size-4" />
        </Link>
      </Button>
      <div className="min-w-0">
        <CardTitle className="text-sm">{title}</CardTitle>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export const FormRow = ({
  id,
  label,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label
      htmlFor={id}
      className="font-mono text-[10px] tracking-[0.14em] uppercase"
    >
      {label}
      {required ? (
        <span aria-hidden className="text-destructive">
          *
        </span>
      ) : null}
    </Label>
    {children}
    {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
  </div>
);

/** 保存・キャンセルの並び。全フォームで同じ位置・同じ順序に揃える。 */
export const FormActions = ({
  pending,
  submitLabel,
  pendingLabel,
  backHref,
}: {
  pending: boolean;
  submitLabel: string;
  pendingLabel: string;
  backHref: string;
}) => (
  <div className="flex items-center gap-2 border-t pt-4">
    <Button type="submit" disabled={pending}>
      {pending ? pendingLabel : submitLabel}
    </Button>
    <Button asChild variant="ghost">
      <Link href={backHref}>キャンセル</Link>
    </Button>
  </div>
);
