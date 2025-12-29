import Link from "next/link"


interface CommonButtonProps {
  text: string;
  // 標準はホームへ
  link?: string | null;
}


const CommonButton = ({text, link}: CommonButtonProps) => {
  return (
    <button className="bg-blue-500 hover:bg-blue-400 rounded text-white px-4 py-2">
      <Link href={link ? link : "/"}>{text}</Link>
    </button>
  )
}

export default CommonButton