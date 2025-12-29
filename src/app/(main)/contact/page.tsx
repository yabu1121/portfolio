'use client'

import CommonButton from "@/app/components/common/CommonButton"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import toast from "react-hot-toast"

const ContactPage = () => {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      content: contentRef.current?.value || ''
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
        toast('送信が完了しました')
        if (nameRef.current) nameRef.current.value = '';
        if (emailRef.current) emailRef.current.value = '';
        if (contentRef.current) contentRef.current.value = '';
        router.push("/contact/result")
      } else {
        toast('エラーが発生しました')
      }
    } catch (e) {
      toast('エラーが発生しました')
      console.error(e)
    }
  }


  return (
    <div className="max-w-4xl mx-auto ">
        <h1 className="text-2xl text-center font-bold mb-6 mt-20">お問い合わせ</h1>
        <form
          className="space-y-4 px-8 my-20 bg-white rounded py-10 border border-gray-150 mx-4 "
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center">
            <label htmlFor="name" className="block mb-2 font-medium w-30">名前</label>
            <input
              type="text"
              id="name"
              name='name'
              ref={nameRef}
              placeholder="お名前を入力して下さい"
              className="bg-white rounded w-full p-2 border border-black"
            />
          </div>

          <div className="flex justify-between items-center">
            <label htmlFor="email" className="block mb-2 font-medium w-30">email</label>
            <input
              type="email"
              id="email"
              name='email'
              ref={emailRef}
              placeholder="メールアドレスを入力してください"
              className="bg-white rounded w-full p-2 border border-black"
            />
          </div>

          <div className="flex justify-between items-center">
            <label htmlFor="message" className="block mb-2 font-medium w-30">メッセージ</label>
            <textarea
              name="message"
              id="message"
              ref={contentRef}
              placeholder='メッセージを入力してください。'
              className="bg-white rounded w-full p-2 border border-black resize-none"
            ></textarea>
          </div>

          <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2 block mx-auto">送信</button>
        </form>
    </div>
  )
}

export default ContactPage