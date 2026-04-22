'use client'
import { api } from "@/trpc/client"
import Loading from "../common/AdminLoading";
import Error from "../common/Error";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdminContact = () => {
  const [email, setEmail] = useState("");
  const [senderUser, setSenderUser] = useState("");
  const [senderPassword, setSenderPassword] = useState("");
  const utils = api.useUtils();

  const { data, isLoading, error } = api.mail.getMail.useQuery();

  useEffect(() => {
    if (data) {
      setEmail(data.email);
      setSenderUser(data.senderUser ?? "");
      setSenderPassword(data.senderPassword ?? "");
    }
  }, [data]);

  const setMail = api.mail.setMail.useMutation({
    onSuccess: () => {
      toast.success(data ? "更新しました" : "登録しました");
      utils.mail.getMail.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMail.mutate({
      email: email.trim(),
      senderUser: senderUser.trim(),
      senderPassword: senderPassword.trim(),
    });
  };

  const isEditing = !!data;
  const buttonLabel = isEditing
    ? (setMail.isPending ? "編集中..." : "編集")
    : (setMail.isPending ? "追加中..." : "追加");

  return (
    <div>
      <h2 className="font-bold my-2">送信先管理</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 my-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">送信先メールアドレス</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="recipient@mail.com"
            className="border rounded px-3 py-1.5 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">送信元 Gmail アドレス</span>
          <input
            type="email"
            value={senderUser}
            onChange={(e) => setSenderUser(e.target.value)}
            placeholder="sender@gmail.com"
            className="border rounded px-3 py-1.5 text-sm"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Gmail アプリパスワード</span>
          <input
            type="password"
            value={senderPassword}
            onChange={(e) => setSenderPassword(e.target.value)}
            placeholder="xxxx xxxx xxxx xxxx"
            className="border rounded px-3 py-1.5 text-sm"
            required
          />
        </label>

        <button
          type="submit"
          disabled={setMail.isPending}
          className="self-start px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium disabled:opacity-50 cursor-pointer"
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
};

export default AdminContact;
