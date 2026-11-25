import type { Metadata } from "next";
import { SITE_URL } from "./content";

export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Mediawise Solutions: marketing, revenue and systems for established regional businesses" };

export function pageMeta(path: string, title: string, description: string): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Mediawise Solutions", locale: "en_AU", type: "website", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

