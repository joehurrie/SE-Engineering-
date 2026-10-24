import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { getFooterSettings } from "@/lib/footer-content";

export const metadata: Metadata = {
  title: "Specialized Engineering Kenya Ltd. | Elevator & Lift Solutions",
  description:
    "Kenya's premier elevator solutions provider. 200+ elevators installed since 2016. Expert installation, maintenance, and modernization services.",
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerData = await getFooterSettings();

  return (
    <div className="public-site">
      <Navbar />
      <main className="bg-[#f5f5f5] text-[#0a0a0a]">{children}</main>
      <Footer data={footerData} />
    </div>
  );
}
