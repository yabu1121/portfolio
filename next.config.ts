import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tsuyqcbklalcewjyiaad.supabase.co",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        port: '',
        pathname: '/**',
      },
      // works の "Hate AI" がリポジトリ上の画像を直接参照しているため許可。
      // 恒久的には /api/upload で Supabase に移すのが望ましい。
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: '',
        pathname: '/**',
      },
    ]
  },
  allowedDevOrigins: [
    'http://192.168.40.55:3000',
  ]
};

export default nextConfig;
