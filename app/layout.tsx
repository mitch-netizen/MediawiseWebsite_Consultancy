import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SITE_URL, EMAIL, PHONE } from "./lib/content";

const display = localFont({ src: "./fonts/Fraunces-Full.woff2", variable: "--font-display", weight: "100 900", display: "swap" });
const body = localFont({ src: "./fonts/DMSans-Variable.ttf", variable: "--font-body", weight: "300 700", display: "swap" });
const serif = localFont({ src: "./fonts/Fraunces-Italic.ttf", variable: "--font-serif", style: "italic", weight: "300 700", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mediawise Solutions | Marketing, Revenue and Systems for Established Regional Businesses",
    template: "%s | Mediawise Solutions",
  },
  description:
    "Mitch Harris works with established regional businesses turning over $1M to $20M to tighten the chain from first enquiry to cash in the bank: marketing, sales and the systems in between. Based in Central Queensland.",
  openGraph: {
    siteName: "Mediawise Solutions",
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
  },
  icons: { icon: "/favicon.ico" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Mediawise Solutions",
  url: SITE_URL,
  email: EMAIL,
  telephone: PHONE,
  founder: { "@type": "Person", name: "Mitch Harris" },
  areaServed: "AU",
  address: { "@type": "PostalAddress", addressRegion: "QLD", addressCountry: "AU" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${display.variable} ${body.variable} ${serif.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
