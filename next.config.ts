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
    ]
  },
  allowedDevOrigins: [
    'http://192.168.40.55:3000',
  ]
};

export default nextConfig;
