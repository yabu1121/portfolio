import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, content } = data;
    console.log(name, email, content);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAILUSER,
        pass: process.env.GMAILPASSWORD
      },
    });

    await transporter.sendMail({
      from: email,
      to: "hayabusa115346@gmail.com",
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
      message: '送信が完了しました'
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      message: 'エラーが発生しました'
    }, { status: 500 });
  }
}

