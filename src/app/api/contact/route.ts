import nodemailer from "nodemailer";
import { db } from "@/db";
import { contact } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, content } = data;

    const [config] = await db.select().from(contact).limit(1);
    if (!config || !config.senderUser || !config.senderPassword) {
      return Response.json({
        success: false,
        message: "送信設定が登録されていません",
      }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.senderUser,
        pass: config.senderPassword.replace(/\s+/g, ""),
      },
    });

    await transporter.sendMail({
      from: email,
      to: config.email,
      subject: `[お問い合わせ] ${name} 様より`,
      text: `${content} (from ${email})`,
      html: `
        <p>名前: ${name}</p>
        <p>メール: ${email}</p>
        <p>メッセージ:</p>
        <p>${content}</p>
      `,
    });

    return Response.json({
      success: true,
      message: "送信が完了しました",
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      message: "エラーが発生しました",
    }, { status: 500 });
  }
}
