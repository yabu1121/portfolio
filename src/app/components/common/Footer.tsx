import { ActivityIcon, Highlighter, Rabbit, Send, UserRound } from "lucide-react"

const Footer = () => {
  return (
    <footer className='md:hidden bottom-0 fixed w-screen'>
      <ul className="bg-slate-300 flex justify-between w-full h-full">
        <li className="w-1/5 h-full flex items-center justify-center text-sm py-4">
          <div>
            <UserRound />
            <p>Top</p>
          </div>
        </li>
        <li className="w-1/5 h-full flex items-center justify-center text-sm py-4">
          <div>
            <Highlighter />
            <p>About</p>
          </div>
        </li>
        <li className="w-1/5 h-full flex items-center justify-center text-sm py-4">
          <div>
            <ActivityIcon />
            <p>Works</p>
          </div>
        </li>
        <li className="w-1/5 h-full flex items-center justify-center text-sm py-4">
          <div>
            <Send />
            <p>Contact</p>
          </div>
        </li>
        <li className="w-1/5 h-full flex items-center justify-center text-sm py-4">
          <div>
            <Rabbit />
            <p>Links</p>
          </div>
        </li>
      </ul>
    </footer>
  )
}

export default Footer