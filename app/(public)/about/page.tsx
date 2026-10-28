import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import {
  AboutTimeline,
  CredentialsGallery,
} from "@/components/AboutInteractions";
import CareersSection, { type CareerOpening } from "@/components/CareersSection";
import AboutTeamBento from "@/components/AboutTeamBento";
import { getContentValue, getHomeContentMap, loadSiteContentMap } from "@/lib/home-content";
import ScrollRevealPage from "@/components/ScrollRevealPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us | Specialized Engineering Kenya Ltd.",
  description:
    "Learn about Specialized Engineering Kenya Ltd. — 54+ engineers, 10+ international manufacturing partners, and 500+ elevators installed.",
};

const milestones = [
  { year: "2016", event: "Incorporated in Kilimani, Nairobi with core technical elevator specialists." },
  { year: "2017", event: "Completed first milestone commercial project — 8 high-speed passenger elevators." },
  { year: "2019", event: "Solidified exclusive XIZI international manufacturing & supply partnership." },
  { year: "2021", event: "Passed 100th elevator installation landmark across Nairobi metropolitan area." },
  { year: "2023", event: "Expanded 24/7 preventative rapid response maintenance fleet across Nairobi." },
  { year: "2025+", event: "Celebrated 200+ elevators installed; recognized as premier developer engineering partner." },
];

export default async function AboutPage() {
  let aboutContent = null;
  let aboutProfile: Record<string, string> = {};
  let pageContent: Awaited<ReturnType<typeof loadSiteContentMap>> = {};
  let openings: CareerOpening[] = [];
  let careersUnavailable = false;
  try {
    aboutContent = await prisma.siteContent.findUnique({
      where: { sectionKey: "about_intro" },
    });
  } catch (error) {
    console.error("Failed to query about content:", error);
  }

  try {
    const profile = await prisma.siteContent.findUnique({
      where: { sectionKey: "about_profile" },
    });
    if (profile) aboutProfile = getHomeContentMap([profile]).about_profile || {};
  } catch (error) {
    console.error("Failed to query About profile content:", error);
  }

  try {
    pageContent = await loadSiteContentMap([
      "about_intro",
      "about_overview",
      "about_timeline",
      "about_certifications",
      "about_team",
      "about_careers",
      "about_cta",
    ]);
  } catch (error) {
    console.error("Failed to query additional About page content:", error);
  }

  try {
    openings = await prisma.jobVacancy.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        department: true,
        location: true,
        employmentType: true,
        description: true,
        requirements: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to query published career opportunities:", error);
    careersUnavailable = true;
  }

  const hero = pageContent.about_intro;
  const overview = pageContent.about_overview;
  const team = pageContent.about_team || aboutProfile;
  const timeline = pageContent.about_timeline;
  const certifications = pageContent.about_certifications;
  const careers = pageContent.about_careers;
  const cta = pageContent.about_cta;
  const heroImg = getContentValue(hero, "imageUrl", aboutContent?.imageUrl || "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1600");
  const title = getContentValue(hero, "title", aboutContent?.title || "About Specialized Engineering.");
  const subtitle = getContentValue(hero, "subtitle", aboutContent?.subtitle || "CORPORATE PROFILE");
  const bodyText = getContentValue(hero, "bodyText", aboutContent?.bodyText || "Kenya's trusted vertical transportation engineering firm since 2016. Delivering international ISO safety, direct factory supply, and unwavering reliability.");
  const galleryDefaults = [
    {
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=85&w=1200",
      caption: "Engineering collaboration",
    },
    {
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=85&w=900",
      caption: "Technical planning",
    },
    {
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=85&w=900",
      caption: "On-site engineering",
    },
    {
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=85&w=900",
      caption: "Service and maintenance",
    },
  ];
  // Read _entryCount saved by the CMS; fall back to 4 for backwards compatibility
  const galleryCount = typeof team?._entryCount === "number" && team._entryCount > 0
    ? team._entryCount
    : 4;
  const gallery = Array.from({ length: galleryCount }, (_, index) => ({
    image: getContentValue(team, `galleryImage${index + 1}`, galleryDefaults[index]?.image ?? ""),
    caption: getContentValue(team, `galleryCaption${index + 1}`, galleryDefaults[index]?.caption ?? ""),
  }));
  return (
    <ScrollRevealPage className="about-page min-h-screen bg-white text-neutral-900 selection:bg-blue-600 selection:text-white">

      {/* ── 1. Hero: 70% View Height (matching Services and News) ── */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-b border-neutral-200 bg-[#F5F5F3] px-6 py-14 sm:py-16 md:py-20 text-center">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Specialized Engineering team architectural skyline"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="w-full max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center my-auto">
          <div className="mb-4 inline-flex items-center gap-2 border border-[#2563EB] bg-[#2563EB] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            {subtitle}
          </div>
          <h1 className="mb-4 text-center text-4xl font-bold uppercase tracking-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl">
            {title}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6" />
          <p className="mx-auto max-w-xl text-center text-base font-light leading-relaxed text-white drop-shadow-lg md:text-lg">
            {bodyText}
          </p>
          <Link
            href={getContentValue(hero, "buttonHref", "/contact")}
            className="mt-3 inline-flex min-h-12 items-center gap-2 border border-white px-6 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-blue-600"
          >
            {getContentValue(hero, "buttonLabel", "Contact Our Team")}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── 2. Corporate Overview (Centered Header & Balanced Layout) ─────── */}
      <section className="w-full min-h-[50vh] md:min-h-[60vh] py-24 md:py-32 bg-white border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-20 md:mb-24">
            <div className="inline-block px-3.5 py-1.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-widest border border-neutral-200 mb-5">
              {getContentValue(overview, "badge", "Established 2016 · Kilimani")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-black leading-tight mb-5 text-center">
              {getContentValue(overview, "title", "Pioneering Lift Engineering in East Africa.")}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8" />
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed font-light text-center">
              {getContentValue(overview, "bodyText", "Specialized Engineering Kenya Ltd. was established in 2016 with a distinct engineering mandate: elevate the safety, reliability, and architectural aesthetics of vertical transportation in Kenya.")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <div className="space-y-6 lg:col-span-6">
              <h3 className="text-2xl font-bold uppercase tracking-tight text-black">
                {getContentValue(overview, "subheading", "Precision Standards & Certified Execution")}
              </h3>
              <p className="text-neutral-600 text-base leading-relaxed font-light">
                {getContentValue(overview, "supportingCopy", "Headquartered in Kilimani, Nairobi, our team brings together more than 54 engineers and technical professionals. Our relationships with 10+ international elevator manufacturers give developers dependable access to carefully sourced systems and local technical support.")}
              </p>
              <p className="text-neutral-600 text-base leading-relaxed font-light">
                {getContentValue(overview, "secondaryCopy", "From high-speed commercial passenger towers to bespoke residential panoramic capsules, our multidisciplinary teams manage mechanical shaft installation, electrical systems, and commissioning with uncompromising precision.")}
              </p>
              <div className="pt-4">
                <Link
                  href={getContentValue(overview, "buttonHref", "/contact")}
                  className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 rounded-none transition-colors"
                >
                  <span>{getContentValue(overview, "buttonLabel", "Contact Our Team")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-none overflow-hidden shadow-2xl border-[16px] border-neutral-100">
                <img
                  src={getContentValue(overview, "imageUrl", "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1200")}
                  alt="Elevator tower engineering"
                  className="w-full h-[460px] object-cover transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Build to deliver ─ */}
      <section className="w-full border-b border-neutral-200 bg-[#F7F8FA] px-6 py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid items-end gap-10 border-b border-neutral-300 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                {getContentValue(aboutProfile, "partnershipLabel", "BUILT TO DELIVER")}
              </p>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-950 md:text-6xl">
                {getContentValue(aboutProfile, "partnershipTitle", "Global partnerships. Dependable engineering.")}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600">
                {getContentValue(aboutProfile, "partnershipDescription", "Our ecosystem of leading international elevator manufacturers gives clients broader equipment choice, reliable sourcing, certified components, and long-term technical support.")}
              </p>
            </div>
            <div className="flex items-end gap-4 border-l border-neutral-300 pl-6 sm:gap-6 sm:pl-10">
              <p className="text-[clamp(6rem,14vw,12rem)] font-medium leading-[0.8] tracking-[-0.08em] text-neutral-950">
                {getContentValue(aboutProfile, "partnershipCount", "10")}<span className="text-[#2563EB]">+</span>
              </p>
              <p className="mb-1 max-w-[11rem] text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-neutral-600">
                {getContentValue(aboutProfile, "partnershipProof", "Leading international manufacturing companies")}
              </p>
            </div>
          </div>
          <div className="grid gap-px border-b border-neutral-300 bg-neutral-300 md:grid-cols-3">
            {[
              [getContentValue(aboutProfile, "benefit1Title", "Sourcing"), getContentValue(aboutProfile, "benefit1Description", "A wider choice of proven elevator systems matched to each building and its use.")],
              [getContentValue(aboutProfile, "benefit2Title", "Reliability"), getContentValue(aboutProfile, "benefit2Description", "Manufacturer-aligned equipment and genuine components support dependable operation.")],
              [getContentValue(aboutProfile, "benefit3Title", "Accountability"), getContentValue(aboutProfile, "benefit3Description", "One local engineering partner from system selection through long-term maintenance.")],
            ].map(([heading, description]) => (
              <article key={heading} className="bg-[#F7F8FA] py-7 pr-6 md:py-9 md:pr-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-900">{heading}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-600">{description}</p>
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
              {getContentValue(timeline, "badge", "Corporate Milestones")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black text-center">
              {getContentValue(timeline, "title", "The Journey of Excellence")}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>

          <AboutTimeline
            milestones={milestones.map((milestone, index) => ({
              year: getContentValue(timeline, `milestone${index + 1}Year`, milestone.year),
              event: getContentValue(timeline, `milestone${index + 1}Event`, milestone.event),
            }))}
          />
        </div>
      </section>

      <section id="certifications" className="scroll-mt-28 w-full border-b border-neutral-200 bg-white py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl space-y-12 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-block border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
              {getContentValue(certifications, "badge", "Quality, safety & compliance")}
            </div>
            <h2 className="mb-5 text-center text-4xl font-bold uppercase tracking-tight text-black md:text-5xl">
              {getContentValue(certifications, "title", "Our Certifications")}
            </h2>
            <div className="mx-auto h-1 w-20 bg-blue-600" />
            <p className="mt-6 text-base font-light leading-relaxed text-neutral-600 md:text-lg">
              {getContentValue(certifications, "bodyText", "A selection of the standards and credentials behind our commitment to dependable engineering. Certification images will be updated as our documents are added.")}
            </p>
          </div>
          <CredentialsGallery
            items={(() => {
              // Determine entry count: prefer _entryCount saved in CMS, fall back to 4
              const defaultFallbacks = [
                { title: "Quality Management", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=85&w=900" },
                { title: "Safety Compliance", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=85&w=900" },
                { title: "Technical Certification", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=85&w=900" },
                { title: "Industry Credentials", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=85&w=900" },
              ];
              const savedCount = typeof certifications?._entryCount === "number" && certifications._entryCount > 0
                ? certifications._entryCount
                : 4;
              return Array.from({ length: savedCount }, (_, i) => ({
                title: getContentValue(certifications, `caption${i + 1}`, defaultFallbacks[i]?.title ?? `Certification ${i + 1}`),
                image: getContentValue(certifications, `image${i + 1}`, defaultFallbacks[i]?.image ?? ""),
              }));
            })()}
          />
        </div>
      </section>

      {/* ── 6. Team gallery ─ */}
      <section className="w-full bg-neutral-50 px-6 py-20 md:py-28 overflow-hidden">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-14 mx-auto max-w-3xl text-center flex flex-col items-center justify-center">
            <div className="mb-4 inline-block border border-neutral-200 bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">
              {getContentValue(team, "badge", "People & practice")}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-neutral-950 text-center">
              {getContentValue(team, "title", getContentValue(team, "galleryTitle", "Our people"))}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto my-5" />
            <p className="text-sm md:text-base text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed text-center">
              {getContentValue(team, "bodyText", "The engineers and specialists behind each project, working together from planning through ongoing service.")}
            </p>
          </div>
          <AboutTeamBento photos={gallery} />
        </div>
      </section>

      <CareersSection
        openings={openings}
        unavailable={careersUnavailable}
        eyebrow={getContentValue(careers, "badge", "Careers")}
        title={getContentValue(careers, "title", "Join us.")}
        description={getContentValue(careers, "bodyText", "Bring your skills to a team engineering safer, more dependable vertical transportation.")}
        applyLabel={getContentValue(careers, "buttonLabel", "Apply now")}
      />

      <section className="w-full bg-neutral-100 px-6 py-16 text-neutral-900 md:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">
              {getContentValue(cta, "subtitle", "Specialized Engineering Kenya Ltd.")}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {getContentValue(cta, "title", "Ready to move your next project forward?")}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 md:text-base">
              {getContentValue(cta, "bodyText", "Let’s find the right lift or elevator solution for your building.")}
            </p>
          </div>
          <Link
            href={getContentValue(cta, "buttonHref", "/contact")}
            className="inline-flex h-12 shrink-0 items-center gap-3 bg-blue-700 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-blue-800"
          >
            {getContentValue(cta, "buttonLabel", "Talk to our team")} <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </ScrollRevealPage>
  );
}
