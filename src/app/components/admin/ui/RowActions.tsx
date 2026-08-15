'use client'

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const EditButton = ({ href }: { href: string }) => (
  <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
    <Link href={href}>
      <Pencil className="size-3.5" />
      {/* 狭い画面では操作列の幅を確保できないのでラベルを隠す */}
      <span className="hidden sm:inline">編集</span>
    </Link>
  </Button>
);

/**
 * 削除は AlertDialog で確認する（従来は window.confirm）。
 * 一覧に赤いボタンが並ぶと目が「危険」に慣れるので、既定は無彩色にして
 * hover で初めて赤くする。
 */
export const DeleteButton = ({
  name,
  onConfirm,
  pending,
  label = "削除",
  description,
}: {
  name: string;
  onConfirm: () => void;
  pending?: boolean;
  label?: string;
  description?: string;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        disabled={pending}
        className="h-7 px-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
        <span className="hidden sm:inline">{pending ? "削除中..." : label}</span>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{description ?? "削除しますか？"}</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-2">
            <span className="block rounded border bg-muted px-2.5 py-1.5 font-mono text-xs break-all text-foreground">
              {name}
            </span>
            <span className="block">この操作は取り消せません。</span>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>キャンセル</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-white hover:bg-destructive/90"
        >
          削除する
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
