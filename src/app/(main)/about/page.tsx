import Aboutme from "@/app/components/Aboutme"
import AboutProfile from "@/app/components/AboutProfile"
import AboutTimeline from "@/app/components/AboutTimeline"
import AboutSkills from "@/app/components/AboutSkills"
import AboutContact from "@/app/components/AboutContact"
import AboutLinks from "@/app/components/AboutLinks"
import AboutEvent from "@/app/components/AboutEvent"

const AboutPage = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Aboutme />
        <AboutProfile />
        <AboutTimeline />
        <AboutEvent/>
        <AboutSkills />
        <AboutContact />
        <AboutLinks />
    </div>
  )
}

export default AboutPage