import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Specialized Engineering Kenya Ltd. | Elevator & Lift Solutions",
  description:
    "Kenya's premier elevator solutions provider. 200+ elevators installed since 2016. Expert installation, maintenance, and modernization services.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="bg-[#f5f5f5] text-[#0a0a0a]">{children}</main>
      <Footer />
    </>
  );
}
