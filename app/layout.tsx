import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mitch Harris - Marketing & Revenue Strategist | Mediawise Solutions",
  description: "Portfolio and consultancy website for Mitch Harris - Marketing & Revenue Strategist based in Central Queensland, Australia. Expert in revenue generation, growth strategy, and marketing optimization.",
  keywords: [
    "marketing strategist",
    "revenue growth",
    "business consulting",
    "Central Queensland",
    "marketing consultant",
    "sales strategy",
  ],
  authors: [{ name: "Mitch Harris" }],
  openGraph: {
    title: "Mitch Harris - Marketing & Revenue Strategist",
    description: "Portfolio and consultancy website for Mitch Harris - Marketing & Revenue Strategist based in Central Queensland, Australia.",
    url: "https://mediawisesolutions.com.au",
    siteName: "Mediawise Solutions",
    images: [
      {
        url: "https://mediawisesolutions.com.au/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mediawise Solutions - Marketing & Revenue Strategy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitch Harris - Marketing & Revenue Strategist",
    description: "Portfolio and consultancy website for Mitch Harris - Marketing & Revenue Strategist based in Central Queensland, Australia.",
    images: ["https://mediawisesolutions.com.au/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mitch Harris",
    url: "https://mediawisesolutions.com.au",
    image: "https://mediawisesolutions.com.au/og-image.png",
    jobTitle: "Marketing & Revenue Strategist",
    worksFor: {
      "@type": "LocalBusiness",
      name: "Mediawise Solutions",
      url: "https://mediawisesolutions.com.au",
      areaServed: "AU",
      address: {
        "@type": "PostalAddress",
        addressRegion: "QLD",
        addressCountry: "AU",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#101820" />
        <StructuredData />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
