import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      <body className="overflow-x-hidden bg-gray-300">
        <TRPCProvider>
          <Header />
          {children}
          <Footer />
        </TRPCProvider>
      </body>
    </html>
  );
}
