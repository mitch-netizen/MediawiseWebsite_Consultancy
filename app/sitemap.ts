import type { MetadataRoute } from "next";
import { SITE_URL, offers } from "./lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/automation", "/pricing", "/about", "/contact", ...offers.map((o) => `/automation/${o.slug}`)];
  return pages.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: new Date() }));
}
