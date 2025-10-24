import Image from "next/image"

const About = () => {
  return (
    <section id="about">
      <div>
        <h1>About Me</h1>
        <div></div>
      </div>

      <div>
        <div>
          <div></div>
          <Image 
            src='/images/profileImage.jpg'
            alt="profileImage"
            width={200}
            height={200}
            className="rounded"
          />
        </div>

        <div>
          <h2>yabu</h2>
          <p>19</p>
          <p>こんにちは、yabuです。エンジニアになるためにプログラミングを学んでいます。作品を通じて、私のスキルや成長を見ていただければと思います。</p>
        </div>
      </div>
    </section>
  )
}

export default About