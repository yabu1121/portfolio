import nodemailer from "nodemailer";
import { lt, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { contactAttempts } from "@/db/schema";
import { ipHash } from "@/app/utils/visitor";
import { withLog } from '@/lib/request-log'

/*
 * お問い合わせフォームの送信。
 *
 * 送信アカウントは **環境変数から読む**。以前は contact テーブルに Gmail の
 * パスワードを平文で持っていたが、DB を読める経路が 1 つでもあれば一緒に漏れる。
 * 管理画面を Cloudflare Access で固めても、そこは守れない。
 *
 * 設定が揃っていなければ送らずに 503 を返す。パスワード無しで送信を試みて
 * 失敗ログに認証情報の断片が出るより、手前で止める方がよい。
 */

const config = () => {
  const user = process.env.CONTACT_SMTP_USER;
  const pass = process.env.CONTACT_SMTP_PASSWORD;
  const to = process.env.CONTACT_TO ?? user;

  if (!user || !pass || !to) return undefined;

  // Gmail のアプリパスワードは表示時に空白が入るので落とす
  return { user, pass: pass.replace(/\s+/g, ""), to };
};

/*
 * 受け取る中身。**長さを必ず決める。**
 *
 * 何も見ずに受けると、数 MB の本文がそのまま自分の受信箱に届くし、
 * 文字列以外（配列やオブジェクト）が来たときに "[object Object]" が
 * メールに出る。改行は本文だけに許し、名前と宛先には入れない
 * （ヘッダーに入ると件名や宛先を足せてしまう）。
 */
const oneLine = (max: number) =>
  z.string().trim().min(1).max(max).refine((value) => !/[\r\n]/.test(value), {
    message: "改行は入れられません",
  });

const schema = z.object({
  name: oneLine(100),
  email: oneLine(200).pipe(z.email()),
  content: z.string().trim().min(1).max(2000),
  /*
   * 罠。人には見えない欄なので、埋まっていたら機械。
   * **ここで弾かない。** 長さで撥ねると 400 が返り、見破られたことが
   * 相手に分かって書き換えられる。受け取ってから、下で黙って捨てる。
   */
  website: z.string().max(500).optional(),
});

/*
 * 同じ回線からの連投を止める。
 *
 * **Vercel の Firewall では止められない**（Hobby プランはレート制限の
 * ルールを公開できない）ので、ここで数える。
 *
 * **送る前に 1 つ予約する。** 「数えてから送る」にすると、同時に叩かれた
 * ときにどれもまだ上限に達しておらず、全部通ってしまう。足してから
 * 足した結果を受け取る 1 文（upsert の returning）にすれば、同じ瞬間に
 * 来ても片方は必ず大きい数を受け取る。
 *
 * **IP が取れなくても素通しにしない。** 取れないときは 'unknown' という
 * 1 つの枠にまとめて入れる。ヘッダーを落として上限を外す、ができない。
 *
 * ip は塩付きのハッシュ。元に戻せないので、誰かを追う用途には使えない。
 */
const WINDOW_MINUTES = 10;
const MAX_PER_WINDOW = 5;

const reserve = async (ip: string | null) => {
  // 10 分で切り捨てた時刻。同じ枠の中は 1 行にまとまる
  const windowStart = new Date(
    Math.floor(Date.now() / (WINDOW_MINUTES * 60 * 1000)) * WINDOW_MINUTES * 60 * 1000,
  );

  const [row] = await db
    .insert(contactAttempts)
    .values({ ip: ip ?? "unknown", windowStart, count: 1 })
    .onConflictDoUpdate({
      target: [contactAttempts.ip, contactAttempts.windowStart],
      set: { count: sql`${contactAttempts.count} + 1` },
    })
    .returning({ count: contactAttempts.count });

  // 置き場が壊れているときは送らない（開けっ放しにしない）
  if (!row) return false;

  // 1 日より古い行は置いておく意味が無い。たまに掃除する
  if (Math.random() < 0.02) {
    await db
      .delete(contactAttempts)
      .where(lt(contactAttempts.windowStart, new Date(Date.now() - 24 * 60 * 60 * 1000)))
      .catch(() => {});
  }

  return row.count <= MAX_PER_WINDOW;
};

/** メールは HTML でも送るので、入力をそのまま埋めない */
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string,
  );

const handlePost = async (request: Request): Promise<Response> => {
  const settings = config();
  if (!settings) {
    console.error("CONTACT_SMTP_USER / CONTACT_SMTP_PASSWORD が未設定です");
    return Response.json(
      { success: false, message: "送信設定がされていません" },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { success: false, message: "入力を確かめてください" },
      { status: 400 },
    );
  }

  const { name, email, content, website } = parsed.data;

  /*
   * 罠に掛かったときは 200 を返す。「弾かれた」と分かると書き換えて
   * 来るので、送ったように見せて何もしない。
   */
  if (website) {
    return Response.json({ success: true, message: "送信が完了しました" }, { status: 200 });
  }

  const allowed = await reserve(ipHash(request.headers)).catch(() => false);
  if (!allowed) {
    return Response.json(
      { success: false, message: "しばらく時間をおいてからお試しください" },
      { status: 429 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: settings.user, pass: settings.pass },
    });

    await transporter.sendMail({
      /*
       * 差出人の**アドレス**は自分のアカウントから変えられない。
       * Gmail は認証したアカウント以外を差出人にできず、入れ替えると
       * 書き換えられるか拒否される（SPF / DMARC のため）。
       *
       * **表示名だけは自由。** ここに送ってきた人の名前を入れておくと、
       * 受信箱の一覧が「自分」の羅列ではなく相手の名前で並ぶ。
       * 名前は検証済みで改行が入らないので、ヘッダに置いても安全。
       */
      from: { name: `${name}（お問い合わせ）`, address: settings.user },
      replyTo: email,
      to: settings.to,
      subject: `[お問い合わせ] ${name} 様より`,
      text: `${content}\n\n---\n名前: ${name}\nメール: ${email}`,
      html: `
        <p>名前: ${escapeHtml(name)}</p>
        <p>メール: ${escapeHtml(email)}</p>
        <p>メッセージ:</p>
        <p>${escapeHtml(content).replace(/\n/g, "<br>")}</p>
      `,
    });

    return Response.json({ success: true, message: "送信が完了しました" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "エラーが発生しました" }, { status: 500 });
  }
}

/* 記録は入口で取る。経路は型のまま */
export const POST = withLog('/api/contact', handlePost)
