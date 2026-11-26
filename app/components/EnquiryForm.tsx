"use client";
import { useEffect, useState } from "react";
import { ENQUIRY_FORM_URL } from "../lib/content";

// Maps campaign tags in the page address to the hidden Jotform fields (source, campaign, ad).
// The tags are kept for the browser session so they survive a click to another page.
const FIELDS: Record<string, string> = {
  utm_source: "q9_textbox7",
  utm_campaign: "q10_textbox8",
  utm_content: "q11_textbox9",
};
const KEY = "mw_utm";

export default function EnquiryForm({ title = "Mediawise Solutions enquiry form" }: { title?: string }) {
  const [src, setSrc] = useState(ENQUIRY_FORM_URL);

  useEffect(() => {
    let tags: Record<string, string> = {};
    try {
      const params = new URLSearchParams(window.location.search);
      for (const k of Object.keys(FIELDS)) {
        const v = params.get(k);
        if (v) tags[k] = v.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 60);
      }
      if (Object.keys(tags).length) sessionStorage.setItem(KEY, JSON.stringify(tags));
      else tags = JSON.parse(sessionStorage.getItem(KEY) || "{}");
    } catch {
      /* storage can be blocked; the form still works without tags */
    }
    const q = Object.entries(FIELDS)
      .filter(([k]) => tags[k])
      .map(([k, field]) => `${field}=${encodeURIComponent(tags[k])}`)
      .join("&");
    if (q) setSrc(`${ENQUIRY_FORM_URL}?${q}`);
  }, []);

  return <iframe className="form-embed" src={src} title={title} loading="lazy" />;
}
