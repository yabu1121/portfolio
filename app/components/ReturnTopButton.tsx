import Link from "next/link"

const ReturnTopButton = () => {
  return (
    <button className="bg-blue-500 hover:bg-blue-400 rounded text-white px-4 py-2"><Link href="/">TOPに戻る</Link></button>
  )
}

export default ReturnTopButton