import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LiftServicesShowcase, {
  type LiftServiceContent,
} from "@/components/LiftServicesShowcase";
import ScrollRevealPage from "@/components/ScrollRevealPage";
import { getContentValue, getHomeContentMap, loadSiteContentMap, type HomeContentSection } from "@/lib/home-content";
import prisma from "@/lib/prisma";
import {
  serviceClientOutcomes,
  serviceLifecycleCopy,
  servicePillars,
} from "@/lib/service-pillars";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Supply, Installation & Maintenance",
  description:
    "End-to-end elevator supply, precision installation and proactive maintenance from Specialized Engineering Kenya Ltd.",
};

const sectionText = (section: HomeContentSection, key: string, fallback: string) =>
  section[key]?.trim() || fallback;

export default async function LiftServicesPage() {
  let content: HomeContentSection = {};
  let pageContent: Awaited<ReturnType<typeof loadSiteContentMap>> = {};

  try {
    const [savedContent, savedPageContent] = await Promise.all([
      prisma.siteContent.findUnique({ where: { sectionKey: "home_services" } }),
      loadSiteContentMap(["services_hero", "services_showcase", "services_lifecycle", "services_outcomes"]),
    ]);
    if (savedContent) content = getHomeContentMap([savedContent]).home_services || {};
    pageContent = savedPageContent;
  } catch (error) {
    console.error("Failed to fetch CMS-managed service content:", error);
  }
  const hero = pageContent.services_hero;
  const showcase = pageContent.services_showcase;
  const lifecycle = pageContent.services_lifecycle;
  const outcomesContent = pageContent.services_outcomes;

  const services: LiftServiceContent[] = servicePillars.map((service, index) => {
    const pNum = index + 1;
    return {
      slug: service.slug,
      num: service.number,
      badge: getContentValue(showcase, `service${pNum}Badge`, `SE-${service.number}`),
      title: getContentValue(showcase, `service${pNum}Title`, sectionText(content, `service${pNum}Title`, service.title)),
      tagline: getContentValue(showcase, `service${pNum}Tagline`, service.tagline),
      desc: getContentValue(showcase, `service${pNum}Description`, sectionText(content, `service${pNum}Description`, service.description)),
      features: service.features.map((feature, featureIndex) =>
        getContentValue(showcase, `service${pNum}Feature${featureIndex + 1}`, sectionText(content, `service${pNum}Feature${featureIndex + 1}`, feature))
      ),
      img: getContentValue(showcase, `service${pNum}Image`, service.image),
      buttonLabel: getContentValue(showcase, `service${pNum}ButtonLabel`, `Discuss ${service.title.toLowerCase()}`),
      buttonHref: getContentValue(showcase, `service${pNum}ButtonHref`, `/contact?service=${service.slug}`),
      ...(index === 2
        ? {
            partsTitle: getContentValue(showcase, "partsTitle", sectionText(content, "maintenancePartsTitle", service.partsTitle || "")),
            partsDescription: getContentValue(showcase, "partsDescription", sectionText(content, "maintenancePartsDescription", service.partsDescription || "")),
            partsFeatures: (service.partsFeatures || []).map((feature, featureIndex) =>
              getContentValue(showcase, `partsFeature${featureIndex + 1}`, sectionText(content, `maintenancePartsFeature${featureIndex + 1}`, feature))
            ),
            partsButtonLabel: getContentValue(showcase, "partsButtonLabel", "Browse genuine components"),
            partsButtonHref: getContentValue(showcase, "partsButtonHref", "/elevators#spare-parts"),
          }
        : {}),
    };
  });
  const outcomes = serviceClientOutcomes.map((outcome, index) =>
    getContentValue(showcase, `serviceOutcome${index + 1}`, sectionText(content, `serviceOutcome${index + 1}`, outcome))
  );

  return (
    <ScrollRevealPage className="min-h-screen bg-white text-neutral-950">
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-b border-neutral-200 bg-[#F5F5F3] px-6 py-14 sm:py-16 md:py-20 text-center">
        <div className="absolute inset-0 z-0">
          {hero?.videoUrl?.trim() ? (
            <video src={hero.videoUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <img
              src={getContentValue(hero, "imageUrl", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=85&w=1800")}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white drop-shadow-lg">
            {getContentValue(hero, "subtitle", "ENGINEERING & LIFECYCLE")}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl">
            {getContentValue(hero, "title", "Lift services, end to end.")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white drop-shadow-lg md:text-lg">
            {getContentValue(hero, "bodyText", "From choosing the right system to keeping it safe and dependable for years to come, one team is accountable throughout.")}
          </p>
          <Link
            href={getContentValue(hero, "buttonHref", "#supply")}
            className="mt-8 inline-flex min-h-12 items-center gap-2 border border-white/60 px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-[#2563EB] hover:bg-[#2563EB]"
          >
            {getContentValue(hero, "buttonLabel", "Explore our services")} <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LiftServicesShowcase
        services={services}
        subtitle={getContentValue(showcase, "subtitle", "SUPPLY · INSTALLATION · MAINTENANCE")}
        title={getContentValue(showcase, "title", "Three services. One accountable partner.")}
        lifecycleCopy={getContentValue(showcase, "bodyText", sectionText(content, "bodyText", serviceLifecycleCopy))}
        outcomes={outcomes}
      />

      <section id="lifecycle" className="border-t border-neutral-200 bg-white px-6 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-10 border-b border-neutral-200 pb-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">
                {getContentValue(lifecycle, "subtitle", "ENGINEERED THROUGH THE LIFECYCLE")}
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl">
                {getContentValue(lifecycle, "title", "Every stage strengthens the next.")}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-neutral-600">
              {getContentValue(lifecycle, "bodyText", "Equipment choice, installation quality and aftercare are connected decisions. Keeping them with one engineering partner helps control whole-life costs, preserve safety standards and protect the availability of your lift.")}
            </p>
          </div>

          <div className="grid gap-px border-b border-neutral-200 bg-neutral-200 md:grid-cols-3">
            {[
              {
                number: getContentValue(lifecycle, "stage1Number", "01"),
                title: getContentValue(lifecycle, "stage1Title", "Specify for lifetime value"),
                description: getContentValue(lifecycle, "stage1Description", "We assess building use, traffic demand and performance needs before recommending a system. Selecting the right capacity and configuration can limit avoidable energy, repair and replacement costs over time."),
              },
              {
                number: getContentValue(lifecycle, "stage2Number", "02"),
                title: getContentValue(lifecycle, "stage2Title", "Install with documented quality"),
                description: getContentValue(lifecycle, "stage2Description", "Experienced engineers coordinate site readiness, installation checks, testing and commissioning. Recorded inspections and a structured handover make engineering compliance, quality and safety requirements visible before operation."),
              },
              {
                number: getContentValue(lifecycle, "stage3Number", "03"),
                title: getContentValue(lifecycle, "stage3Title", "Maintain before issues grow"),
                description: getContentValue(lifecycle, "stage3Description", "Preventative maintenance schedules follow manufacturer guidance, equipment usage and observed condition. Routine servicing, genuine parts and clear records help detect wear early, reduce unplanned downtime and extend service life."),
              },
            ].map((stage) => (
              <article key={stage.number} className="bg-[#F7F8FA] p-6 sm:p-8 md:p-9">
                <span className="font-mono text-xs font-semibold text-[#2563EB]">{stage.number}</span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-neutral-950">{stage.title}</h3>
                <p className="mt-4 text-sm leading-7 text-neutral-600">{stage.description}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-3xl">
              <h3 className="text-lg font-semibold text-neutral-950">{getContentValue(lifecycle, "assuranceTitle", "Quality assurance that carries through.")}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                {getContentValue(lifecycle, "assuranceCopy", "From supply documentation to installation records and scheduled service reports, a consistent technical history supports safer decisions, clearer accountability and better-informed lifecycle planning.")}
              </p>
            </div>
            <Link
              href={getContentValue(lifecycle, "buttonHref", "/contact")}
              className="inline-flex min-h-12 w-fit items-center gap-2 border border-neutral-300 px-6 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-900 transition-colors hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white"
            >
              {getContentValue(lifecycle, "buttonLabel", "Plan a service programme")} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">
            {getContentValue(outcomesContent, "subtitle", "ONE ENGINEERING PARTNER")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            {getContentValue(outcomesContent, "title", "A better lifecycle starts with a conversation.")}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-600">
            {getContentValue(outcomesContent, "bodyText", "Tell us about your building, equipment or project. Our engineering team will help define the right next step.")}
          </p>
          <Link
            href={getContentValue(outcomesContent, "buttonHref", "/contact")}
            className="mt-8 inline-flex min-h-12 items-center gap-2 bg-neutral-950 px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#2563EB]"
          >
            {getContentValue(outcomesContent, "buttonLabel", "Request a consultation")} <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </ScrollRevealPage>
  );
}
