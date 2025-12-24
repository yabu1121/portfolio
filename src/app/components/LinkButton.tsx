import Link from "next/link";

interface LinkButtonProps {
  url: string | null;
  text: string;
}

const LinkButton = ({url, text}: LinkButtonProps) => {
  return (
    <>
      {url 
      ? (
        <Link className="text-blue-600 hover:underline cursor-pointer" href={url} target="_blank" rel="noreferrer">
          {text}
        </Link>
      )
      : (
        <p className="text-gray-900/50">
          {text}
        </p>
      )}
    </>
  )
}

export default LinkButton