import Image from "next/image"

const Skills = () => {
  const skillsList = [
    { id: 1, name: "React.js", url:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"},
    { id: 2, name: "Next.js", url:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"},
    { id: 3, name: "Tailwind CSS", url:"https://tailwindcss.com/_next/static/media/tailwindcss-mark.d52e9897.svg"},
    { id: 4, name: "C++", url:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/288px-ISO_C%2B%2B_Logo.svg.png"},
    { id: 5, name: "prisma", url:"https://w7.pngwing.com/pngs/130/82/png-transparent-prisma-hd-logo-thumbnail.png"},
    { id: 6, name: "Supabase", url:"https://logo.svgcdn.com/d/supabase-original-8x.png"},
  ]
  return (
    <section id="skills">
      <h2 className="text-2xl text-center my-4 ">学習中スキル</h2> 
      <div className="grid grid-cols-5 gap-4 m-8">
        {skillsList.map((skill) => {
          return (
            <div key={skill.id} className="px-8 py-4 bg-gray-200 rounded text-center mx-auto">
              <Image
                src={skill.url}
                alt={`${skill.name}-icon`}
                width={80}
                height={80}
                className=""
              />
              <div>
                <span className="text-sm">{skill.name}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Skills