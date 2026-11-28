import type { MetadataRoute } from "next";
export const dynamic = "force-static";
import { SITE_URL, offers, areas } from "./lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-26");
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: `${SITE_URL}${path}/`.replace(/\/\/$/, "/"),
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    entry("", 1, "weekly"),
    ...areas.map((a) => entry(`/services/${a.slug}`, 0.9)),
    entry("/automation", 0.8),
    ...offers.map((o) => entry(`/automation/${o.slug}`, 0.7)),
    entry("/how-it-works", 0.8),
    entry("/who-its-for", 0.7),
    entry("/about", 0.8),
    entry("/pricing", 0.7),
    entry("/contact", 0.6),
  ];
}
