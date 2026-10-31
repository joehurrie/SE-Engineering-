import type { Metadata } from "next";
import ContactPageClient from "@/components/ContactPageClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.specializedengineeringltd.co.ke";

export const metadata: Metadata = {
  title: "Contact Us — Request a Consultation | Specialized Engineering Kenya",
  description:
    "Contact Specialized Engineering Kenya Ltd. for elevator installation, maintenance, or modernization inquiries. Based in Kilimani, Nairobi — serving Kenya and East Africa.",
  keywords: [
    "contact elevator company Kenya",
    "elevator consultation Nairobi",
    "lift installation inquiry",
    "elevator quote Kenya",
    "Specialized Engineering contact",
    "Kilimani elevator company",
  ],
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    url: `${SITE_URL}/contact`,
    title: "Contact Us — Elevator & Lift Consultation | Specialized Engineering Kenya",
    description:
      "Reach our engineering team for installation quotes, maintenance contracts, or modernization assessments. Kilimani, Nairobi — 24/7 emergency standby.",
    images: [{ url: `${SITE_URL}/og-image.jpeg`, width: 1200, height: 630 }],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
