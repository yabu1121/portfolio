import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { TRPCProvider } from "@/trpc/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin | Hayato's Portfolio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 min-h-screen`}>
        <TRPCProvider>
          <div className="mx-auto max-w-5xl p-6">
            {children}
          </div>
        </TRPCProvider>
      </body>
    </html>
  );
}
