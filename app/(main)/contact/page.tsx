'use client'

import ReturnTopButton from "@/app/components/ReturnTopButton"
import { useRef } from "react"

const ContactPage = () => {
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
      // fetchの第一引数はエンドポイントで第二引数はデータの詳細。
      const res = await fetch('/api/contact', {
        // 好きなメソッドを指定できる
        method: 'POST',
        // 好きなヘッダをつけて返せる
        headers: {
          'Content-Type': 'application/json'
        },

        // JavaScript のオブジェクトや値を JSON 文字列に変換する、メソッドに対応するデータを書き込む。
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        alert('送信が完了しました')
        if (nameRef.current) nameRef.current.value = '';
        if (emailRef.current) emailRef.current.value = '';
        if (contentRef.current) contentRef.current.value = '';
      } else {
        alert('エラーが発生しました')
      }
    } catch (e) {
      alert('エラーが発生しました')
      console.error(e)
    }
  }


  return (
    <>
      <form
        className="text-center mx-auto max-w-md p-8 items-center mb-12 md:mt-12 rounded-lg md:shadow-md md:border-2"
        onSubmit={handleSubmit}
      >

        <h1 className="text-2xl text-center font-bold mb-6">お問い合わせ</h1>

        <div className="my-4 text-left">
          <label htmlFor="name" className="block mb-2 font-medium">名前 : </label>
          <input
            type="text"
            id="name"
            name='name'
            ref={nameRef}
            placeholder="お名前を入力して下さい"
            className="bg-white rounded w-full p-2 border"
          />
        </div>

        <div className="my-4 text-left">
          <label htmlFor="email" className="block mb-2 font-medium">email : </label>
          <input
            type="email"
            id="email"
            name='email'
            ref={emailRef}
            placeholder="メールアドレスを入力してください"
            className="bg-white rounded w-full p-2 border"
          />
        </div>

        <div className="my-4 text-left">
          <label htmlFor="message" className="block mb-2 font-medium">メッセージ : </label>
          <textarea
            name="message"
            id="message"
            ref={contentRef}
            placeholder='メッセージを入力してください。'
            className="bg-white rounded w-full p-2 border"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-600 mt-6 font-bold"
        >
          送信
        </button>
      </form>
    </>
  )
}

export default ContactPage