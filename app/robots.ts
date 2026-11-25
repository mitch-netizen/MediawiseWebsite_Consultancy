import type { MetadataRoute } from "next";
export const dynamic = "force-static";
import { SITE_URL } from "./lib/content";

// Search engines and AI assistants are all welcome to read and cite this site.
const aiAgents = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Googlebot", "Bingbot",
  "Applebot", "Applebot-Extended",
  "DuckAssistBot", "MistralAI-User", "CCBot", "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...aiAgents.map((userAgent) => ({ userAgent, allow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
