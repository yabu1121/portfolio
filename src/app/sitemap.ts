import type { MetadataRoute } from "next";

const routes = ["", "/about", "/projects", "/contact", "/licenses", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `https://www.y4bu.net${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/about" || route === "/projects" ? 0.8 : 0.5,
  }));
}
