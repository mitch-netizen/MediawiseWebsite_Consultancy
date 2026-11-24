import type { MetadataRoute } from "next";
export const dynamic = "force-static";
import { SITE_URL, offers, areas } from "./lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/who-its-for", "/how-it-works", ...areas.map((a) => `/services/${a.slug}`), "/automation", "/pricing", "/about", "/contact", ...offers.map((o) => `/automation/${o.slug}`)];
  return pages.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: new Date() }));
}
