import Link from "next/link"

const ReturnTopButton = () => {
  return (
    <button className="text-blue-500 absolute m-4"><Link href="/">←TOPに戻る</Link></button>
  )
}

export default ReturnTopButton