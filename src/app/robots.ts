import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/contact/result"],
    },
    sitemap: "https://www.y4bu.net/sitemap.xml",
    host: "https://www.y4bu.net",
  };
}
