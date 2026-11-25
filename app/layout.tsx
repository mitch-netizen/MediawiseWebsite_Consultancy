import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SITE_URL, EMAIL, ABN, offers } from "./lib/content";
import { OG_IMAGE } from "./lib/seo";

const display = localFont({ src: "./fonts/Fraunces-Full.woff2", variable: "--font-display", weight: "100 900", display: "swap" });
const body = localFont({ src: "./fonts/DMSans-Variable.ttf", variable: "--font-body", weight: "300 700", display: "swap" });
const serif = localFont({ src: "./fonts/Fraunces-Italic.ttf", variable: "--font-serif", style: "italic", weight: "300 700", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Marketing, Sales and Automation Consultant, Central Queensland | Mediawise Solutions",
    template: "%s | Mediawise Solutions",
  },
  description:
    "Mitch Harris helps established regional businesses turning over $1M to $20M tighten the chain from first enquiry to cash in the bank: marketing, sales, and Power Automate systems. Based in Central Queensland, working Australia wide.",
  applicationName: "Mediawise Solutions",
  authors: [{ name: "Mitch Harris", url: `${SITE_URL}/about` }],
  creator: "Mitch Harris",
  alternates: { canonical: SITE_URL },
  openGraph: {
    siteName: "Mediawise Solutions",
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  icons: { icon: "/favicon.ico" },
  other: { "geo.region": "AU-QLD", "geo.placename": "Central Queensland" },
};

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#mitch-harris`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "Organization"],
      "@id": ORG_ID,
      name: "Mediawise Solutions",
      url: SITE_URL,
      logo: `${SITE_URL}/logo-horizontal-dark.png`,
      image: `${SITE_URL}/og.png`,
      email: EMAIL,
      telephone: "+61409265711",
      taxID: `ABN ${ABN}`,
      foundingDate: "2023",
      founder: { "@id": PERSON_ID },
      description:
        "Marketing, revenue and systems consultancy for established regional Australian businesses turning over $1M to $20M. Fixed price Power Automate automation builds, plus bespoke marketing, sales and leadership work.",
      slogan: "Revenue strategy that moves.",
      address: { "@type": "PostalAddress", addressRegion: "QLD", addressCountry: "AU" },
      areaServed: [
        { "@type": "City", name: "Gladstone" },
        { "@type": "City", name: "Rockhampton" },
        { "@type": "AdministrativeArea", name: "Central Queensland" },
        { "@type": "State", name: "Queensland" },
        { "@type": "Country", name: "Australia" },
      ],
      knowsAbout: [
        "Marketing strategy",
        "Google Ads",
        "Meta advertising",
        "Fractional marketing leadership",
        "Sales process design",
        "Sales team coaching",
        "CRM set up",
        "Revenue diagnostics",
        "Business process automation",
        "Microsoft Power Automate",
        "Microsoft 365",
        "Xero automation",
      ],
      priceRange: "$$",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Fixed price automation builds",
        itemListElement: offers.map((o) => ({
          "@type": "Offer",
          name: o.name,
          description: o.fixes,
          url: `${SITE_URL}/automation/${o.slug}`,
          priceSpecification: { "@type": "PriceSpecification", price: o.price, priceCurrency: "AUD", valueAddedTaxIncluded: false },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Mitch Harris",
      jobTitle: "Founder, Mediawise Solutions",
      worksFor: { "@id": ORG_ID },
      url: `${SITE_URL}/about`,
      hasCredential: ["Microsoft Power Automate", "Smartsheet", "Advanced Salesforce CRM reporting"].map((c) => ({ "@type": "EducationalOccupationalCredential", name: c })),
      description:
        "A decade in commercial leadership. Former General Sales Manager at Southern Cross Austereo across Rockhampton, Gladstone and Emerald, where he led a team of 12 and a portfolio of around $7M and took the region to the number one national regional revenue ranking.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Mediawise Solutions",
      inLanguage: "en-AU",
      publisher: { "@id": ORG_ID },
    },
  ],
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
