import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { TRPCProvider } from "@/trpc/Provider";
import { Toaster } from "@/components/ui/sonner";
import { AdminShell } from "../components/admin/ui/AdminShell";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-svh overflow-hidden antialiased`}
      >
        <TRPCProvider>
          {/* AdminShell は useSearchParams を使うので Suspense で包む */}
          <Suspense fallback={null}>
            <AdminShell>{children}</AdminShell>
          </Suspense>
          <Toaster position="bottom-right" richColors />
        </TRPCProvider>
      </body>
    </html>
  );
}
