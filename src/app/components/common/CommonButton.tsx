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
    <Link href={link ? link : ""}>
      <button type={type} className={`bg-blue-500 hover:bg-blue-400 rounded text-white px-4 py-2 cursor-pointer ${className}`}>
      {text}
      </button>
    </Link>
  )
}

export default CommonButton