import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | Specialized Engineering Kenya Ltd.",
  description:
    "Learn about Specialized Engineering Kenya Ltd. — established 2016 in Kilimani, 200+ elevators installed, 30+ expert technical professionals.",
};

const team = [
  { name: "Alan",                       role: "Managing Director",                       phone: "+254 (0)116 000100", email: "alan@specializedengineering.co.ke" },
  { name: "Ana",                        role: "Operations Director",                     phone: "+254 (0)713 104907", email: "ana@specializedengineering.co.ke" },
  { name: "Engineering Division",       role: "30+ Certified Technicians & Specialists", phone: "+254 (0)116 000100", email: "specializedengineeringltd@gmail.com" },
];

const milestones = [
  { year: "2016", event: "Incorporated in Kilimani, Nairobi with core technical elevator specialists." },
  { year: "2017", event: "Completed first milestone commercial project — 8 high-speed passenger elevators." },
  { year: "2019", event: "Solidified exclusive XIZI international manufacturing & supply partnership." },
  { year: "2021", event: "Passed 100th elevator installation landmark across Nairobi metropolitan area." },
  { year: "2023", event: "Expanded 24/7 preventative rapid response maintenance fleet across Nairobi." },
  { year: "2025+", event: "Celebrated 200+ elevators installed; recognized as premier developer engineering partner." },
];

const advantages = [
  {
    title: "XIZI Exclusive Partnership",
    desc: "Exclusive supply privileges for XIZI elevator systems in Kenya — direct manufacturer pricing, zero intermediary markup.",
  },
  {
    title: "30+ Technical Professionals",
    desc: "Elite multidisciplinary engineering corps including senior technical consultants and factory-trained Kenyan technicians.",
  },
  {
    title: "200+ Operational Installations",
    desc: "From bespoke residential villa capsule lifts to high-density commercial towers, our portfolio shows zero-compromise execution.",
  },
  {
    title: "Full-Lifecycle Partnership",
    desc: "End-to-end stewardship from structural shaft planning and architectural approvals through to 24/7 preventative maintenance.",
  },
];

export default async function AboutPage() {
  let aboutContent = null;
  try {
    aboutContent = await prisma.siteContent.findUnique({
      where: { sectionKey: "about_intro" },
    });
  } catch (error) {
    console.error("Failed to query about content:", error);
  }

  const heroImg = aboutContent?.imageUrl || "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1600";
  const title = aboutContent?.title || "About Specialized Engineering.";
  const subtitle = aboutContent?.subtitle || "CORPORATE PROFILE";
  const bodyText = aboutContent?.bodyText || "Kenya's trusted vertical transportation engineering firm since 2016. Delivering international ISO safety, direct factory supply, and unwavering reliability.";

  return (
    <div className="bg-white text-neutral-900 min-h-screen selection:bg-blue-600 selection:text-white">

      {/* ── 1. Hero: 50vh View Height (Nexia Standard) ───────── */}
      <section className="w-full min-h-screen pt-32 pb-16 relative overflow-hidden border-b border-neutral-900 flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Specialized Engineering team architectural skyline"
            className="w-full h-full object-cover brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="w-full max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
            {subtitle}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white mb-4 text-center">
            {title}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6" />
          <p className="text-neutral-400 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed text-center">
            {bodyText}
          </p>
        </div>
      </section>

      {/* ── 2. Corporate Overview (Centered Header & Balanced Layout) ─────── */}
      <section className="w-full min-h-[50vh] md:min-h-[60vh] py-24 md:py-32 bg-white border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-20 md:mb-24">
            <div className="inline-block px-3.5 py-1.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-widest border border-neutral-200 mb-5">
              Established 2016 · Kilimani
            </div>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-black leading-tight mb-5 text-center">
              Pioneering Lift Engineering in East Africa.
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8" />
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed font-light text-center">
              Specialized Engineering Kenya Ltd. was established in 2016 with a distinct engineering mandate:
              elevate the safety, reliability, and architectural aesthetics of vertical transportation in Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-2xl font-bold uppercase tracking-tight text-black">
                Precision Standards &amp; Certified Execution
              </h3>
              <p className="text-neutral-600 text-base leading-relaxed font-light">
                Headquartered in Kilimani, Nairobi, our team has grown to over 30 certified professionals.
                Through our direct exclusive partnership with international manufacturer XIZI, we offer developers access to world-class traction technology with uncompromised local technical support.
              </p>
              <p className="text-neutral-600 text-base leading-relaxed font-light">
                From high-speed commercial passenger towers to bespoke residential panoramic capsules, our multidisciplinary teams manage mechanical shaft installation, electrical systems, and commissioning with uncompromising precision.
              </p>
              <div className="pt-4">
                <Link
                  href="/contact"
                  className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 rounded-none transition-colors"
                >
                  <span>Consult Our Leadership</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-none overflow-hidden shadow-2xl border-[16px] border-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1200"
                  alt="Elevator tower engineering"
                  className="w-full h-[460px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-6 right-6 bg-blue-600 text-white px-4 py-2 text-xs font-bold z-20">
                  200+ INSTALLATIONS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Core Advantages (Sharp Cards with Bottom Border) ─ */}
      <section className="w-full min-h-[75vh] md:min-h-screen py-32 md:py-48 bg-neutral-50 border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-20 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="inline-block px-3.5 py-1.5 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-5 border border-neutral-200">
              Enterprise Strengths
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black mb-5 text-center">
              Our Core Advantages
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {advantages.map((adv, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center space-y-4 border border-neutral-200 bg-white p-7 text-center transition-colors hover:border-neutral-400 md:p-9"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 flex items-center justify-center rounded-none font-bold text-xs">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-neutral-500 font-bold uppercase tracking-widest">
                    ADVANTAGE {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-black uppercase tracking-tight text-center">
                  {adv.title}
                </h3>
                <p className="text-neutral-600 text-base leading-relaxed font-light text-center">
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Journey Timeline ───────────────────────────────── */}
      <section className="w-full min-h-[75vh] md:min-h-screen py-32 md:py-48 bg-white border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-6 space-y-20">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-widest border border-neutral-200">
              Corporate Milestones
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black text-center">
              The Journey of Excellence
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>

          <div className="relative pt-6">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-neutral-200" />

            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`relative flex gap-8 mb-12 last:mb-0 ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className={`flex-1 ${
                    idx % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
                  } pl-12 md:pl-0 space-y-1.5`}
                >
                  <span className="text-blue-600 font-mono text-xl font-bold">{m.year}</span>
                  <p className="text-neutral-600 text-base leading-relaxed font-light">{m.event}</p>
                </div>
                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 bg-black rounded-none flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-none" />
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Leadership Team (Responsive, airy minimal layout) ─ */}
      <section className="w-full bg-neutral-50 section-space">
        <div className="section-shell">
          <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
            <div className="inline-block px-3.5 py-1.5 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-5 border border-neutral-200">
              Key Personnel
            </div>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-black mb-4 text-center">
              Corporate Leadership
            </h2>
            <div className="mx-auto h-1 w-20 bg-blue-600" />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-between border border-neutral-200 bg-white p-7 text-center transition-colors hover:border-neutral-400 md:p-9"
              >
                <div className="flex w-full flex-col items-center text-center">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center bg-black text-lg font-bold text-white rounded-none">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-black text-center">{member.name}</h3>
                  <p className="mb-6 text-center text-[11px] uppercase tracking-wider text-neutral-500 font-mono font-semibold">
                    {member.role}
                  </p>
                </div>
                <div className="w-full space-y-2 border-t border-neutral-100 pt-6 text-sm text-center">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/[^0-9+]/g, "")}`}
                      className="block font-mono text-neutral-600 transition-colors hover:text-blue-600"
                    >
                      {member.phone}
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="block truncate font-mono text-xs text-neutral-600 transition-colors hover:text-blue-600"
                    >
                      {member.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
