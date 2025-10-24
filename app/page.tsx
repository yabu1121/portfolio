import Image from "next/image"
import Header from "./components/Header"
import About from "./components/About"
import Skills from "./components/Skills"
import Projects from "./components/Projects"
import Contact from "./components/Contact"
import News from "./components/News"
import Footer from "./components/Footer"

const HomePage = () => {
  return (
    <>
      <Header />
      <About />
      <Skills />
      <Projects />
      <News />
      <Contact />
      <Footer />
    </>
  )
}

export default HomePage

