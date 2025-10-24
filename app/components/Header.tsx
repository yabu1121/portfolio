const Header = () => {
  const links = [
    { id: 1, topic: "About", link: "about" },
    { id: 2, topic: "Skills", link: "skills" },
    { id: 3, topic: "Projects", link: "projects" },
    { id: 4, topic: "News", link: "news" },
    { id: 5, topic: "Contact", link: "contact" },
  ]
  return (
    <header className="flex items-center justify-between w-full px-8 py-4 bg-white shadow-md sticky top-0 z-50">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">yabu</h1>
        <p className="text-sm text-gray-600">frontend engineer</p>
      </div>
      <nav className="hidden md:block">
        <ul className="flex gap-6">
          {links.map((item) => {
            return (
              <li key={item.id} className="hover:text-blue-600 transition-colors duration-200">
                <a href={`#${item.link}`} className="text-gray-700 hover:text-blue-600">
                  <span>{item.topic}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="flex flex-col items-center justify-center w-8 h-8 cursor-pointer md:hidden">
        <span className="w-full h-0.5 mb-1 bg-gray-600"></span>
        <span className="w-full h-0.5 mb-1 bg-gray-600"></span>
        <span className="w-full h-0.5 bg-gray-600"></span>
      </div>
    </header>
  )
}

export default Header