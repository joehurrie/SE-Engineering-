import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getContentValue, loadSiteContentMap } from "@/lib/home-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Specialized Engineering Kenya Ltd.",
};

export default async function PrivacyPage() {
  let content: Awaited<ReturnType<typeof loadSiteContentMap>> = {};
  try {
    content = await loadSiteContentMap([
      "privacy_hero",
      "privacy_section_1",
      "privacy_section_2",
      "privacy_section_3",
      "privacy_section_4",
      "privacy_section_5",
    ]);
  } catch (error) {
    console.error("Failed to load Privacy page content:", error);
  }
  return (
    <div className="bg-white text-[#111111] min-h-screen">
      {/* Hero: 50vh Centered */}
      <section
        className="min-h-screen pt-32 pb-16 bg-black border-b border-neutral-900 flex items-center justify-center text-center relative overflow-hidden bg-cover bg-center"
        style={content.privacy_hero?.imageUrl ? { backgroundImage: `url("${content.privacy_hero.imageUrl}")` } : undefined}
      >
        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            {getContentValue(content.privacy_hero, "subtitle", "LEGAL & COMPLIANCE")}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white text-center">
            {getContentValue(content.privacy_hero, "title", "Privacy Policy")}<span className="text-blue-500">.</span>
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto" />
          <p className="text-neutral-400 text-sm font-light">
            {getContentValue(content.privacy_hero, "updatedAt", "Last updated: October 2026 · Specialized Engineering Kenya Ltd.")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 md:py-36 bg-neutral-50 border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="bg-white border border-neutral-200 p-10 md:p-14 space-y-10 text-neutral-600 text-base leading-relaxed shadow-sm">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">{getContentValue(content.privacy_section_1, "title", "1. Overview")}</h2>
              <p className="whitespace-pre-line">{getContentValue(content.privacy_section_1, "bodyText", 'Specialized Engineering Kenya Ltd. ("we", "our", or "us") respects your privacy and is committed to protecting personal data collected through our corporate website, inquiry forms, and customer service channels.')}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">{getContentValue(content.privacy_section_2, "title", "2. Information We Collect")}</h2>
              <p className="whitespace-pre-line">{getContentValue(content.privacy_section_2, "bodyText", "When you request a quotation, schedule an inspection, or contact our team in Kilimani, Nairobi, we may collect:\n• Full name, corporate organization, and designation\n• Contact telephone numbers and corporate email address\n• Project building specifications, site location, and elevator requirements\n• For recruitment, applicant contact details, the vacancy applied for, resume or portfolio links, and any message submitted")}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">{getContentValue(content.privacy_section_3, "title", "3. How Information is Used")}</h2>
              <p className="whitespace-pre-line">{getContentValue(content.privacy_section_3, "bodyText", "Information collected is strictly utilized to prepare technical tender drawings, issue equipment quotations, coordinate on-site field visits, and deliver 24/7 emergency service dispatch. We do not sell or lease personal details to third parties.")}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">{getContentValue(content.privacy_section_4, "title", "4. Recruitment Applications")}</h2>
              <p className="whitespace-pre-line">{getContentValue(content.privacy_section_4, "bodyText", "Recruitment information is used only to assess applications and contact candidates about relevant opportunities. Access is limited to authorized personnel involved in recruitment. We do not sell applicant information and retain it only for as long as it is reasonably needed for recruitment or legal obligations. Please provide secure HTTPS links and avoid including sensitive personal information that is not relevant to your application.")}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black uppercase tracking-tight">{getContentValue(content.privacy_section_5, "title", "5. Contact Information")}</h2>
              <p className="whitespace-pre-line">{getContentValue(content.privacy_section_5, "bodyText", "For questions concerning this privacy policy or our data management practices, please contact our operations division at specializedengineeringltd@gmail.com or call +254 116 000 100.")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
