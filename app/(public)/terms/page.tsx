import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTermsOfService } from "@/lib/footer-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.specializedengineeringltd.co.ke";

export const metadata: Metadata = {
  title: "Terms of Service | Specialized Engineering Kenya Ltd.",
  description: "Terms of service and engineering mandate for Specialized Engineering Kenya Ltd.",
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    url: `${SITE_URL}/terms`,
    title: "Terms of Service | Specialized Engineering Kenya Ltd.",
    description: "Terms of service and engineering mandate for Specialized Engineering Kenya Ltd.",
    images: [{ url: `${SITE_URL}/og-image.jpeg`, width: 1200, height: 630, alt: "Specialized Engineering Kenya" }],
  },
};

export default async function TermsPage() {
  const terms = await getTermsOfService();

  const paragraphs = terms.bodyText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="bg-white text-[#111111] min-h-screen font-sans">
      {/* Hero: Centered Editorial */}
      <section className="min-h-[50vh] pt-36 pb-20 bg-neutral-950 border-b border-neutral-900 flex items-center justify-center text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-widest rounded-none">
            {terms.subtitle}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white text-center">
            {terms.title}<span className="text-[#2563EB]">.</span>
          </h1>
          <div className="w-20 h-1 bg-[#2563EB] mx-auto rounded-none" />
          <p className="text-neutral-400 text-sm font-light">
            {terms.updatedAt}
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 md:py-28 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="bg-white border border-[#E2E8F0] p-8 md:p-14 space-y-10 text-neutral-600 text-base leading-relaxed shadow-sm rounded-none">
            {paragraphs.map((para, idx) => {
              const lines = para.split("\n");
              const firstLine = lines[0] || "";
              const isNumberedSection = /^\d+\.\s+/.test(firstLine);

              if (isNumberedSection) {
                const restOfParagraph = lines.slice(1).join("\n");
                return (
                  <div key={idx} className="space-y-3 border-b border-[#F1F5F9] pb-8 last:border-b-0 last:pb-0">
                    <h2 className="text-xl font-bold text-[#0F172A] uppercase tracking-tight">
                      {firstLine}
                    </h2>
                    {restOfParagraph && (
                      <p className="whitespace-pre-line text-[#475569] leading-relaxed">
                        {restOfParagraph}
                      </p>
                    )}
                  </div>
                );
              }

              return (
                <div key={idx} className="space-y-3">
                  <p className="whitespace-pre-line text-[#475569] leading-relaxed">
                    {para}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
