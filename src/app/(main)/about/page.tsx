import Aboutme from "@/app/components/Aboutme"
import AboutTimeline from "@/app/components/AboutTimeline"
import AboutSkills from "@/app/components/AboutSkills"
import AboutEvent from "@/app/components/AboutEvent"

const AboutPage = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Aboutme />
        <AboutTimeline />
        <AboutEvent/>
        <AboutSkills />
    </div>
  )
}

export default AboutPage
