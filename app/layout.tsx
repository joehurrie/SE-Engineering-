import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Specialized Engineering Kenya Ltd. | Elevator & Lift Solutions",
    template: "%s | Specialized Engineering Kenya Ltd.",
  },
  description:
    "Kenya's premier elevator and lift solutions provider. 200+ elevators installed since 2016. Expert installation, maintenance, and modernization of passenger elevators, escalators, hospital lifts, and more.",
  keywords: [
    "elevator Kenya",
    "lift installation Nairobi",
    "passenger elevator",
    "escalator",
    "hospital elevator",
    "home lift",
    "Specialized Engineering Kenya",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Specialized Engineering Kenya Ltd.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.className} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${manrope.className} ${manrope.variable} antialiased bg-[#0f0f0f] text-white selection:bg-[#2563EB] selection:text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
