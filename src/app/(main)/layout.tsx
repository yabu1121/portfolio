import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Space_Grotesk } from "next/font/google";
import "../globals.css";
import Header from "../components/common/Header";
import SiteFooter from "../components/common/SiteFooter";
import { ConsentBanner } from "../components/common/ConsentBanner";
import { PageViews } from "../components/common/PageViews";
import { Insights } from "../components/common/Insights";
import { TRPCProvider } from "@/trpc/Provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*
 * 見出しの英数字。slides / blog と同じ組み合わせにするため足した。
 * 和文は src/app/murecho.css で自前配布している Murecho 900 が受ける。
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Hero の名前に使う、少し人間味のあるディスプレイ用セリフ
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

/*
 * **metadataBase が要る。** これが無いと Next が og:image の絶対 URL を
 * 組めず、SNS に貼っても画像が出ない（相対パスのまま出力される）。
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.y4bu.net"),
  title: {
    default: "那須隼人（Hayato Nasu）｜バックエンドエンジニア",
    template: "%s｜那須隼人",
  },
  description:
    "バックエンドエンジニア・那須隼人（Hayato Nasu）のポートフォリオ。Go、TypeScript、Next.jsを使った制作物、経歴、技術記事、登壇資料を掲載しています。",
  authors: [{ name: "那須隼人", url: "/" }],
  creator: "那須隼人",
  publisher: "那須隼人",
  openGraph: {
    type: "website",
    siteName: "y4bu.net",
    locale: "ja_JP",
    title: "那須隼人（Hayato Nasu）｜バックエンドエンジニア",
    description:
      "バックエンドエンジニア・那須隼人のポートフォリオ。制作物、経歴、技術記事、登壇資料を掲載しています。",
  },
  twitter: {
    card: "summary_large_image",
    title: "那須隼人（Hayato Nasu）｜バックエンドエンジニア",
    description: "バックエンドエンジニア・那須隼人のポートフォリオ。",
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${spaceGrotesk.variable} overflow-x-hidden bg-gray-150`}>
        <TRPCProvider>
          <Header />
          {children}
          <SiteFooter />
          {/* Cookie の同意。返事をするまで何も置かない */}
          <ConsentBanner />
          {/* 閲覧を数える。描画の外からなので、ページのキャッシュに触らない */}
          <PageViews />
          {/* Vercel 側の計測（速さは常時・閲覧は同意後） */}
          <Insights />
          {/* Toaster が無く、お問い合わせフォームのトーストが表示されていなかった */}
          <Toaster position="bottom-right" richColors />
        </TRPCProvider>
      </body>
    </html>
  );
}
