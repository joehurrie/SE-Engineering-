import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import {
  AboutTimeline,
  CredentialsGallery,
} from "@/components/AboutInteractions";
import ScrollRevealPage from "@/components/ScrollRevealPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | Specialized Engineering Kenya Ltd.",
  description:
    "Learn about Specialized Engineering Kenya Ltd. — established 2016 in Kilimani, 200+ elevators installed, 30+ expert technical professionals.",
};

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
    <ScrollRevealPage className="about-page min-h-screen bg-white text-neutral-900 selection:bg-blue-600 selection:text-white">

      {/* ── 1. Hero: 50vh View Height (Nexia Standard) ───────── */}
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden border-b border-neutral-200 bg-[#F5F5F3] pb-16 pt-32">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Specialized Engineering team architectural skyline"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0F0F0F]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/40 via-transparent to-[#0F0F0F]/20" />
        </div>

        <div className="w-full max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center my-auto">
          <div className="mb-4 inline-flex items-center gap-2 border border-white/50 bg-[#1D4ED8]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            {subtitle}
          </div>
          <h1 className="mb-4 text-center text-4xl font-bold uppercase tracking-tight text-white sm:text-6xl md:text-7xl">
            {title}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6" />
          <p className="mx-auto max-w-xl text-center text-base font-light leading-relaxed text-white/90 md:text-lg">
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
            <div className="space-y-6 lg:col-span-6">
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
                  <span>Contact Our Team</span>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Engineering capacity ─ */}
      <section className="w-full border-b border-neutral-200 bg-[#F5F5F3] py-24 md:py-32">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 md:gap-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-5 inline-block border border-neutral-200 bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              Built to deliver
            </div>
            <h2 className="mb-5 text-4xl font-bold uppercase tracking-tight text-[#0F0F0F] md:text-5xl">
              Our Capacity
            </h2>
            <div className="mx-auto h-1 w-20 bg-[#2563EB]" />
            <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-neutral-600">
              The people, partnerships and practical experience to take complex lift projects from first drawing to long-term care.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(230px,auto)]">
            {advantages.map((adv, idx) => (
              <article
                key={adv.title}
                className={[
                  "group relative flex min-h-[250px] flex-col justify-between overflow-hidden border p-7 md:p-9",
                  idx === 0 && "lg:col-span-7 lg:row-span-2 lg:min-h-[485px]",
                  idx === 1 && "lg:col-span-5",
                  idx === 2 && "lg:col-span-5",
                  idx === 3 && "lg:col-span-12 lg:min-h-[220px] lg:flex-row lg:items-end",
                  idx === 1
                    ? "border-[#1D4ED8] bg-[#2563EB] text-white"
                    : "border-neutral-200 bg-white text-[#0F0F0F]",
                ].filter(Boolean).join(" ")}
              >
                {idx === 0 && (
                  <>
                    <img
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=85&w=1200"
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-[#0F0F0F]/65" />
                  </>
                )}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-3 -top-10 select-none text-[9rem] font-bold leading-none tracking-tighter transition-transform duration-700 group-hover:scale-110 md:text-[12rem] ${
                    idx === 0 || idx === 1 ? "text-white/10" : "text-[#2563EB]/[0.07]"
                  }`}
                >
                  0{idx + 1}
                </span>
                <div className="relative z-10">
                  <span className={`font-mono text-xs font-bold uppercase tracking-[0.18em] ${idx === 0 || idx === 1 ? "text-white/75" : "text-[#2563EB]"}`}>
                    Capacity / 0{idx + 1}
                  </span>
                </div>
                <div className={`relative z-10 mt-12 max-w-xl ${idx === 3 ? "lg:ml-auto lg:w-2/3" : ""}`}>
                  <h3 className={`text-2xl font-bold uppercase leading-tight tracking-tight md:text-3xl ${idx === 0 || idx === 1 ? "text-white" : "text-[#0F0F0F]"}`}>
                    {adv.title}
                  </h3>
                  <p className={`mt-4 max-w-lg text-sm font-light leading-relaxed md:text-base ${idx === 0 || idx === 1 ? "text-white/85" : "text-neutral-600"}`}>
                    {adv.desc}
                  </p>
                </div>
              </article>
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

          <AboutTimeline milestones={milestones} />
        </div>
      </section>

      <section id="certifications" className="scroll-mt-28 w-full border-b border-neutral-200 bg-white py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl space-y-12 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-block border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              Quality, safety &amp; compliance
            </div>
            <h2 className="mb-5 text-center text-4xl font-bold uppercase tracking-tight text-black md:text-5xl">
              Our Certifications
            </h2>
            <div className="mx-auto h-1 w-20 bg-blue-600" />
            <p className="mt-6 text-base font-light leading-relaxed text-neutral-600 md:text-lg">
              A selection of the standards and credentials behind our commitment to dependable engineering.
              Certification images will be updated as our documents are added.
            </p>
          </div>
          <CredentialsGallery />
        </div>
      </section>

      {/* ── 6. Our team ─ */}
      <section className="w-full bg-neutral-50 section-space">
        <div className="section-shell">
          <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
            <div className="inline-block px-3.5 py-1.5 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-5 border border-neutral-200">
              Key Personnel
            </div>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-black mb-4 text-center">
              Our Team
            </h2>
            <div className="mx-auto h-1 w-20 bg-blue-600" />
          </div>

          <figure className="mb-12 overflow-hidden border border-neutral-200 bg-white">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=85&w=1800"
              alt="Specialized Engineering colleagues collaborating as a team"
              className="h-[260px] w-full object-cover sm:h-[360px] md:h-[460px]"
            />
            <figcaption className="border-t border-neutral-200 px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
              Our engineering and operations team
            </figcaption>
          </figure>

        </div>
      </section>

      <section className="w-full bg-neutral-100 px-6 py-16 text-neutral-900 md:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">
              Specialized Engineering Kenya Ltd.
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Ready to move your next project forward?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 md:text-base">
              Let’s find the right lift or elevator solution for your building.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 shrink-0 items-center gap-3 bg-blue-700 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-blue-800"
          >
            Talk to our team <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </ScrollRevealPage>
  );
}
