import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.specializedengineeringltd.co.ke";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Specialized Engineering Kenya Ltd. | Elevator & Lift Solutions",
    template: "%s | Specialized Engineering Kenya Ltd.",
  },
  description:
    "Kenya's premier elevator and lift solutions provider. 200+ elevators installed since 2016. Expert installation, maintenance, and modernization of passenger elevators, escalators, hospital lifts, home lifts, and more — headquartered in Kilimani, Nairobi.",
  keywords: [
    "elevator Kenya",
    "lift installation Nairobi",
    "passenger elevator Kenya",
    "escalator installation",
    "hospital elevator",
    "home lift Kenya",
    "panoramic elevator",
    "dumbwaiter",
    "hydraulic platform lift",
    "lift modernization Nairobi",
    "elevator maintenance Kenya",
    "Specialized Engineering Kenya",
    "vertical transport East Africa",
    "elevator company Nairobi",
    "Kilimani engineering",
  ],
  authors: [{ name: "Specialized Engineering Kenya Ltd.", url: SITE_URL }],
  creator: "Specialized Engineering Kenya Ltd.",
  publisher: "Specialized Engineering Kenya Ltd.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: "Specialized Engineering Kenya Ltd.",
    title: "Specialized Engineering Kenya Ltd. | Elevator & Lift Solutions",
    description:
      "Kenya's premier elevator and lift solutions provider. 200+ elevators installed since 2016. Passenger elevators, escalators, home lifts, hospital lifts — Nairobi & East Africa.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpeg`,
        width: 1200,
        height: 630,
        alt: "Specialized Engineering Kenya Ltd. — Elevator & Lift Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Specialized Engineering Kenya Ltd. | Elevator & Lift Solutions",
    description:
      "Kenya's premier elevator and lift solutions provider. 200+ elevators installed since 2016.",
    images: [`${SITE_URL}/og-image.jpeg`],
    creator: "@SpecEngKenya",
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "Engineering & Construction",
};

/** Organization JSON-LD schema for AI and search engine entity understanding */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Specialized Engineering Kenya Ltd.",
  alternateName: "Specialized Engineering",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Kenya's premier elevator and vertical transportation solutions provider. Expert installation, maintenance, and modernization of passenger elevators, escalators, hospital lifts, home lifts — headquartered in Kilimani, Nairobi.",
  foundingDate: "2016",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kilimani Business Hub",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+254116000100",
      contactType: "Managing Director",
      availableLanguage: "English",
    },
    {
      "@type": "ContactPoint",
      telephone: "+254713104907",
      contactType: "Operations",
      availableLanguage: "English",
    },
    {
      "@type": "ContactPoint",
      email: "specializedengineeringltd@gmail.com",
      contactType: "customer service",
    },
  ],
  sameAs: [
    "https://www.specializedengineeringltd.co.ke",
  ],
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: -1.2921,
      longitude: 36.8219,
    },
    geoRadius: "2000000",
    description: "Kenya and East Africa",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Elevator & Lift Solutions",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Passenger Elevator Installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Lift Installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hospital Elevator Supply" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Escalator Installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Panoramic Elevator" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lift Modernization" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Elevator Maintenance" } },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.className} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${manrope.className} ${manrope.variable} antialiased bg-[#0f0f0f] text-white selection:bg-[#2563EB] selection:text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
