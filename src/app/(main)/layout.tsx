import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "../globals.css";
import Header from "../components/common/Header";
import { TRPCProvider } from "@/trpc/Provider";
import Footer from "../components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Hero の名前に使う、少し人間味のあるディスプレイ用セリフ
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Hayato's Portfolio",
  description: "エンジニア志望の自分が作品を掲載していくためのページです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} overflow-x-hidden bg-gray-150`}>
        <TRPCProvider>
          <Header />
          {children}
          <Footer />
        </TRPCProvider>
      </body>
    </html>
  );
}
