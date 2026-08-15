'use client'

import { api } from "@/trpc/client"
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Error from "../common/Error";

const Field = ({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="font-mono text-[10px] tracking-[0.14em] uppercase">
      {label}
    </Label>
    {children}
    {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
  </div>
);

const AdminContact = () => {
  /* 取得値を effect で state に流し込むとカスケード再レンダーになるので、
     「編集されたら state、未編集なら取得値」を都度組み立てる。 */
  const [edited, setEdited] = useState<{
    email?: string;
    senderUser?: string;
    senderPassword?: string;
  }>({});
  const [reveal, setReveal] = useState(false);
  const utils = api.useUtils();

  const { data, isLoading, error } = api.mail.getMail.useQuery();

  const setMail = api.mail.setMail.useMutation({
    onSuccess: async () => {
      toast.success(data ? "更新しました" : "登録しました");
      await utils.mail.getMail.invalidate();
    },
    onError: (e) => toast.error("保存に失敗しました", { description: e.message }),
  });

  if (isLoading) return <Skeleton className="h-80 w-full max-w-xl" />;
  if (error) return <Error error={error} />;

  const email = edited.email ?? data?.email ?? "";
  const senderUser = edited.senderUser ?? data?.senderUser ?? "";
  const senderPassword = edited.senderPassword ?? data?.senderPassword ?? "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMail.mutate({
      email: email.trim(),
      senderUser: senderUser.trim(),
      senderPassword: senderPassword.trim(),
    });
  };

  const isEditing = !!data;

  return (
    <Card className="max-w-xl">
      <CardHeader className="flex-row items-center gap-2.5 space-y-0">
        <CardTitle className="text-sm">連絡先</CardTitle>
        <Badge variant={isEditing ? "default" : "outline"} className="text-[10px]">
          {isEditing ? "設定済み" : "未設定"}
        </Badge>
      </CardHeader>

      <CardContent>
        <p className="mb-5 text-xs leading-relaxed text-muted-foreground">
          公開サイトのお問い合わせフォームが使う設定です。フォームの送信内容は、
          ここで指定した送信元 Gmail から送信先アドレスへ届きます。
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field id="to" label="送信先アドレス" hint="問い合わせを受け取るアドレス">
            <Input
              id="to"
              type="email"
              value={email}
              onChange={(e) => setEdited((p) => ({ ...p, email: e.target.value }))}
              placeholder="recipient@mail.com"
              required
            />
          </Field>

          <Field id="from" label="送信元 Gmail" hint="送信に使う Gmail アカウント">
            <Input
              id="from"
              type="email"
              value={senderUser}
              onChange={(e) => setEdited((p) => ({ ...p, senderUser: e.target.value }))}
              placeholder="sender@gmail.com"
              required
            />
          </Field>

          <Field
            id="apppass"
            label="Gmail アプリパスワード"
            hint="Google アカウントで発行した16文字のアプリパスワード。通常の Gmail のパスワードでは送信できません"
          >
            <div className="flex items-center gap-2">
              <Input
                id="apppass"
                type={reveal ? "text" : "password"}
                value={senderPassword}
                onChange={(e) => setEdited((p) => ({ ...p, senderPassword: e.target.value }))}
                placeholder="xxxx xxxx xxxx xxxx"
                className="font-mono"
                required
              />
              {/* 入力し直しの取りこぼしを減らすため、目視確認できるようにする */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={reveal ? "パスワードを隠す" : "パスワードを表示"}
                aria-pressed={reveal}
                onClick={() => setReveal((v) => !v)}
              >
                {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
          </Field>

          <div className="flex items-center gap-3 border-t pt-4">
            <Button type="submit" disabled={setMail.isPending}>
              {setMail.isPending ? "保存中..." : isEditing ? "更新する" : "登録する"}
            </Button>
            <span className="text-[11px] text-muted-foreground">
              保存すると公開サイトに即時反映されます
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminContact;
