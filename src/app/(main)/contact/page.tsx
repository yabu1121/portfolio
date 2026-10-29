'use client'

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { GutterMascots } from "@/app/components/common/GutterMascots"

/*
 * お問い合わせ。見た目は slides / blog と同じ言語に寄せている。
 *   地は方眼紙（.paper）／見出しは英数字 Space Grotesk + 和文 Murecho 900
 *   アクセントは空色 1 色／角は丸めない／ラベルは Geist Mono
 */

const label = "block font-mono text-[11px] tracking-wider text-ink-3"
const field =
  "mt-1.5 w-full border border-line bg-white px-3 py-2.5 text-[15px] outline-none transition-colors placeholder:text-ink-3 focus:border-sky"

const ContactPage = () => {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  /*
   * 罠。**人には見えない欄**で、機械だけが埋める。
   * 埋まっていたらサーバ側で捨てる（送ったようには見せる）。
   * display:none ではなく画面の外に出す。見えない欄を無視する機械もいるため。
   */
  const trapRef = useRef<HTMLInputElement>(null)
  // 二重送信を止める。送信中はボタンの見た目も落とす
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    const formData = {
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      content: contentRef.current?.value || '',
      website: trapRef.current?.value || ''
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success('送信が完了しました')
        if (nameRef.current) nameRef.current.value = '';
        if (emailRef.current) emailRef.current.value = '';
        if (contentRef.current) contentRef.current.value = '';
        router.push("/contact/result")
      } else {
        toast.error('送信できませんでした', { description: '時間をおいて再度お試しください' })
      }
    } catch (e) {
      toast.error('送信できませんでした', { description: '時間をおいて再度お試しください' })
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="paper min-h-screen">
      <div className="relative mx-auto w-full max-w-2xl px-5 pt-24 pb-28">
        <GutterMascots
          items={[{ pose: "wave", side: "right", top: 80, width: 130 }]}
        />

        <header className="relative pb-12">
          <h1 className="font-display text-5xl leading-none font-bold tracking-tight text-ink sm:text-6xl">
            Contact
            <span className="mt-3 block text-[0.42em] font-black tracking-wider text-ink-2">
              お問い合わせ
            </span>
          </h1>
          <p className="mt-5 text-[13px] leading-relaxed text-ink-2">
            作品や技術の話、インターンのご相談など、なんでもどうぞ。
            いただいたメールアドレスに返信します。
          </p>
        </header>

        <form className="grid gap-6 border border-line bg-white p-6 sm:p-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className={label}>NAME</label>
            <input
              type="text"
              id="name"
              name="name"
              ref={nameRef}
              required
              placeholder="お名前"
              autoComplete="name"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="email" className={label}>EMAIL</label>
            <input
              type="email"
              id="email"
              name="email"
              ref={emailRef}
              required
              placeholder="you@example.com"
              autoComplete="email"
              className={`${field} font-mono text-[14px]`}
            />
          </div>

          <div>
            <label htmlFor="message" className={label}>MESSAGE</label>
            <textarea
              name="message"
              id="message"
              ref={contentRef}
              required
              rows={9}
              placeholder="ご用件をお書きください"
              className={`${field} resize-y`}
            />
          </div>

          {/* 罠。人には出さない（読み上げにも載せない） */}
          <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
            <label htmlFor="website">website</label>
            <input
              type="text"
              id="website"
              name="website"
              ref={trapRef}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={sending}
              className="bg-sky-ink px-7 py-2.5 font-mono text-[12px] tracking-wider text-white transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {sending ? 'SENDING...' : 'SEND'}
            </button>
            <span className="font-mono text-[11px] text-ink-3">返信は数日以内に</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactPage
