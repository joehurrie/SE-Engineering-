import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Specialized Engineering Kenya Ltd.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white text-[#111111] min-h-screen">
      {/* Hero: 50vh Centered */}
      <section className="min-h-[50vh] min-h-[50svh] min-h-[380px] pt-32 pb-16 bg-black border-b border-neutral-900 flex items-center justify-center text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            LEGAL &amp; COMPLIANCE
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white text-center">
            Privacy Policy<span className="text-blue-500">.</span>
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto" />
          <p className="text-neutral-400 text-sm font-light">
            Last updated: October 2026 · Specialized Engineering Kenya Ltd.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 md:py-36 bg-neutral-50 border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="bg-white border border-neutral-200 p-10 md:p-14 space-y-10 text-neutral-600 text-base leading-relaxed shadow-sm">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">1. Overview</h2>
              <p>
                Specialized Engineering Kenya Ltd. ("we", "our", or "us") respects your privacy and is committed
                to protecting personal data collected through our corporate website, inquiry forms, and customer service channels.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">2. Information We Collect</h2>
              <p>
                When you request a quotation, schedule an inspection, or contact our team in Kilimani, Nairobi, we may collect:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                <li>Full name, corporate organization, and designation</li>
                <li>Contact telephone numbers and corporate email address</li>
                <li>Project building specifications, site location, and elevator requirements</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">3. How Information is Used</h2>
              <p>
                Information collected is strictly utilized to prepare technical tender drawings, issue equipment quotations,
                coordinate on-site field visits, and deliver 24/7 emergency service dispatch. We do not sell or lease personal details to third parties.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">4. Contact Information</h2>
              <p>
                For questions concerning this privacy policy or our data management practices, please contact our
                operations division at{" "}
                <a href="mailto:specializedengineeringltd@gmail.com" className="text-blue-600 underline font-medium">
                  specializedengineeringltd@gmail.com
                </a>{" "}
                or call +254 116 000 100.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
