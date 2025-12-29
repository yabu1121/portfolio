import Aboutme from "@/app/components/Aboutme"
import AboutProfile from "@/app/components/AboutProfile"
import AboutTimeline from "@/app/components/AboutTimeline"
import AboutSkills from "@/app/components/AboutSkills"
import AboutContact from "@/app/components/AboutContact"
import AboutLinks from "@/app/components/AboutLinks"

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Aboutme />
        <AboutProfile />
        <AboutTimeline />
        <AboutSkills />
        <AboutContact />
        <AboutLinks />
    </div>
  )
}

export default AboutPage