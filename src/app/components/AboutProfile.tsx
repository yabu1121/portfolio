const AboutProfile = () => {
  return (
    <section className="px-5 sm:px-8 py-6 sm:py-8 bg-white mt-8 mb-4 rounded p-4">
      <h2 className="mb-2 text-2xl font-medium">Profile</h2>
      <div className="mt-4 space-y-2 px-3 py-3 text-sm sm:text-base leading-relaxed">
        <ul>
          <li>興味： バックエンドのパフォーマンス向上、DBの最適化などUXに直接かかわるようなプログラミング</li>
          <li>得意分野：Next.js TypeScript</li>
          <li>開発環境：Next.js TypeScript Golang</li>
          <br />
          <p>言語経験</p>
          <li>TS: Next.js zustand zod toast</li>
          <li>GO: colly gorm echo cobra-cli</li>
          <li>python: fastAPI whisper OpenCV</li>
        </ul>
      </div>
    </section>
  )
}

export default AboutProfile