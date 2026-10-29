import type { Metadata } from "next"
import TopPageContent from "../components/TopPageContent"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
}

const profileStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: "https://www.y4bu.net/",
  name: "那須隼人（Hayato Nasu）のポートフォリオ",
  mainEntity: {
    "@type": "Person",
    "@id": "https://www.y4bu.net/#person",
    name: "那須隼人",
    alternateName: ["Hayato Nasu", "hayato", "yabu1121"],
    url: "https://www.y4bu.net/",
    jobTitle: "バックエンドエンジニア",
    knowsAbout: ["Go", "TypeScript", "Next.js", "バックエンド開発"],
    sameAs: [
      "https://github.com/yabu1121",
      "https://x.com/papox_57",
      "https://zenn.dev/yabu_p",
      "https://www.instagram.com/squ1_nh",
    ],
  },
}

const HomePage = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileStructuredData) }}
      />
      <main>
        <TopPageContent />
      </main>
    </>
  )
}

export default HomePage

