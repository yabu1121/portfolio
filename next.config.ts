import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      },
      {
        protocol: "https",
        hostname: "tailwindcss.com",
        port: "",
        pathname: "/_next/static/media/tailwindcss-mark.d52e9897.svg",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/wikipedia/commons/thumb/1/18/ISO_C%2B%2B_Logo.svg/288px-ISO_C%2B%2B_Logo.svg.png",
      },

      {
        protocol: "https",
        hostname: "logo.svgcdn.com",
        port: "",
        pathname: "/d/supabase-original-8x.png",
      },
      {
        protocol: "https",
        hostname: "placehold.jp",
        port: "",
        pathname: "/300x200.png",
      }
    ]
  },
  allowedDevOrigins: [
    'http://192.168.40.55:3000',
  ]
};

export default nextConfig;
