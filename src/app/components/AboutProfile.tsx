const AboutProfile = () => {
  return (
    <section className="px-5 sm:px-8 py-6 sm:py-8 bg-white mt-8 mb-4 rounded p-4">
      <h2 className="mb-2 text-2xl font-medium">Profile</h2>
      <div className="mt-4 space-y-2 px-3 py-3 text-sm sm:text-base leading-relaxed">
        <ul className="space-y-1">
          <li>興味：バックエンドのパフォーマンス改善、DB最適化など、UXに直結する裏側の設計</li>
          <li>志向：体感でなく計測して数値で判断する／原理を理解してから使う</li>
          <li>得意：Next.js・TypeScript のフルスタック開発、Go でのAPI開発</li>
          <li>経験：長期インターン2社（受託フルスタック／自社開発）、個人開発を並行</li>
          <br />
          <p className="font-medium">言語・技術</p>
          <li>TypeScript：Next.js / tRPC / Drizzle / Zustand / Zod</li>
          <li>Go：Echo / GORM / Cobra(CLI) / Colly(スクレイピング)</li>
          <li>Python：FastAPI / OpenCV / Whisper</li>
          <li>DB：PostgreSQL / SQLite（EXPLAIN でのクエリ改善）</li>
          <li>基盤・品質：Docker / Supabase / k6 / Playwright</li>
        </ul>
      </div>
    </section>
  )
}

export default AboutProfile
