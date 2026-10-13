import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Specialized Engineering Kenya Ltd.",
};

export default function TermsPage() {
  return (
    <div className="bg-white text-[#111111] min-h-screen">
      {/* Hero: 50vh Centered */}
      <section className="min-h-screen pt-32 pb-16 bg-black border-b border-neutral-900 flex items-center justify-center text-center relative overflow-hidden">
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
            Terms of Service<span className="text-blue-500">.</span>
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
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">1. Engineering Mandate</h2>
              <p>
                Specialized Engineering Kenya Ltd. provides vertical transportation engineering, procurement,
                installation, commissioning, modernization, and preventative maintenance services in compliance
                with Kenyan building standards and international BS EN 81 safety codes.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">2. Quotations &amp; Tenders</h2>
              <p>
                All preliminary quotations and technical specifications provided via this portal are valid for 30 calendar days
                from the date of issuance and remain subject to physical site structural verification by our certified field engineering corps.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">3. Warranty &amp; Guarantees</h2>
              <p>
                All new installations carry our standard 10-year structural workmanship guarantee alongside original manufacturer
                warranties on certified traction motors, microprocessors, and drive controllers.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">4. Jurisdiction</h2>
              <p>
                These terms are governed by the laws of the Republic of Kenya. For inquiries, reach out to our legal department
                at Kilimani Business Hub, Nairobi, Kenya.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
