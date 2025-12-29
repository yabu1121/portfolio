import { techs } from "../utils/data"

const AboutSkills = () => {
  return (
    <section className="px-5 sm:px-8 py-6 sm:py-8 bg-white rounded my-8">
      <h2 className="mb-2 text-2xl font-medium">Skills</h2>
      <div className="space-y-3">
        {techs.map((tech) => (
          <div key={tech.id} className="relative group">
            <div className="flex justify-between text-sm">
              <span tabIndex={0} className="outline-none">{tech.name}</span>
              <span className="text-gray-600">{tech.level}%</span>
            </div>

            <div className="w-full h-2">
              <div className="h-2 bg-blue-500 rounded" style={{ width: `${tech.level}%` }} />
            </div>

            <div
              className="absolute z-10 px-3 py-2 mt-2 text-xs text-gray-800 whitespace-pre-line transition scale-95 -translate-x-1/2 translate-y-1 bg-white rounded-md shadow opacity-0 pointer-events-none left-1/2 top-full group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100"
            >
              {tech.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AboutSkills