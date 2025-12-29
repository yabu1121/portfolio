import Link from "next/link"


interface CommonButtonProps {
  text: string;
  // 標準はホームへ
  link?: string | null;
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
}


const CommonButton = ({text, link, type, className}: CommonButtonProps) => {
  return (
    <button type={type} className={`bg-blue-500 hover:bg-blue-400 rounded text-white px-4 py-2 ${className}`}>
      <Link href={link ? link : "/"}>{text}</Link>
    </button>
  )
}

export default CommonButton