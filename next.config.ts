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
    ]
  },
  allowedDevOrigins: [
    'http://192.168.40.55:3000',
  ]
};

export default nextConfig;
