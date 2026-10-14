import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import prisma from "@/lib/prisma";
import { categoryToSlug } from "@/lib/slugs";
import { getElevatorProductAsset } from "@/lib/elevator-product-assets";
import HomeContactForm from "@/components/HomeContactForm";
import bespokeFallbackImage from "./Assets/design.jpg";
import HomeLandingSections, {
  HomeMetricTransition,
  type HomeProduct,
  type HomeProject,
  type HomePromotion,
} from "@/components/HomeLandingSections";
import type { ElevatorProduct, Project, SiteContent } from "@prisma/client";

export const dynamic = "force-dynamic";

const defaultSystems: HomeProduct[] = [
  {
    series: "SERIES H-300",
    title: "Home lifts",
    desc: "Whisper-quiet residential lifts configured around private homes, available space, and architectural finishes.",
    specs: "Residential · Bespoke cabin options",
    image: getElevatorProductAsset("Home lifts", "Residential").src,
    fallbackImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=85&w=1400",
    href: "/elevators/home-lift",
  },
  {
    series: "SERIES P-800",
    title: "Passenger elevators",
    desc: "Efficient vertical transport for commercial towers, apartments, and mixed-use developments.",
    specs: "Commercial · Gearless traction",
    image: getElevatorProductAsset("Passenger elevators", "Commercial").src,
    fallbackImage: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=85&w=1400",
    href: "/elevators/passenger-elevator",
  },
  {
    series: "SERIES M-600",
    title: "Hospital lifts",
    desc: "Smooth, dependable movement for beds, clinical teams, and essential equipment.",
    specs: "Healthcare · Stretcher-ready",
    image: getElevatorProductAsset("Hospital lifts", "Healthcare").src,
    fallbackImage: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=85&w=1400",
    href: "/elevators/hospital-elevator",
  },
  {
    series: "SERIES E-400",
    title: "Escalators",
    desc: "High-capacity people movement for retail, hospitality, and public transport environments.",
    specs: "Public spaces · Heavy transit duty",
    image: getElevatorProductAsset("Escalators", "Public spaces").src,
    fallbackImage: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=85&w=1400",
    href: "/elevators/escalator-moving-walk",
  },
];

const faqs = [
  {
    q: "How long does a commercial or residential elevator installation take?",
    a: "Standard residential villa lifts take 3 to 4 weeks for shaft installation and commissioning once civil shaft work is complete. Commercial high-rise installations typically span 6 to 10 weeks depending on floor count and speed configurations.",
  },
  {
    q: "What is covered under your 10-Year Workmanship Guarantee?",
    a: "Our warranty covers structural anchoring, guide rail alignments, traction machine mounts, and electrical wiring integrity against installation defects, backed by scheduled maintenance inspections.",
  },
  {
    q: "Do you supply genuine OEM spare parts for other elevator brands?",
    a: "Yes. We maintain factory-certified traction cables, electronic boards, door operators, and safety gears in our Nairobi hub, alongside our exclusive XIZI partnership.",
  },
  {
    q: "How does your 24/7 emergency dispatch service operate?",
    a: "Standby engineering crews cover Kilimani, Westlands, and Upper Hill. When an unexpected fault occurs, technicians dispatch immediately, with an average response time under 30 minutes in Nairobi.",
  },
];

function warnHomeFallback(section: string, reason: unknown) {
  const detail = reason instanceof Error ? reason.message : String(reason);
  console.warn(`Could not load live home ${section}; using defaults: ${detail}`);
}

export default async function HomePage() {
  let heroContent: SiteContent | null = null;
  let dbElevators: ElevatorProduct[] = [];
  let dbProjects: Project[] = [];

  const [heroResult, elevatorsResult, projectsResult] = await Promise.allSettled([
    prisma.siteContent.findUnique({ where: { sectionKey: "home_hero" } }),
    prisma.elevatorProduct.findMany({ orderBy: { id: "asc" } }),
    prisma.project.findMany({ orderBy: { id: "asc" } }),
  ]);

  if (heroResult.status === "fulfilled") {
    heroContent = heroResult.value;
  } else {
    warnHomeFallback("hero content", heroResult.reason);
  }
  if (elevatorsResult.status === "fulfilled") {
    dbElevators = elevatorsResult.value;
  } else {
    warnHomeFallback("elevator products", elevatorsResult.reason);
  }
  if (projectsResult.status === "fulfilled") {
    dbProjects = projectsResult.value;
  } else {
    warnHomeFallback("projects", projectsResult.reason);
  }

  const heroImage = heroContent?.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=85&w=1800&auto=format&fit=crop";
  const heroBadge = heroContent?.subtitle || "PREMIER VERTICAL ENGINEERING";
  const heroTitle = heroContent?.title || "Engineered for every level.";
  const heroBody = heroContent?.bodyText || "High-performance elevator systems engineered for modern architecture. Exclusive XIZI partner delivering ISO safety, German-standard traction, and 24/7 Nairobi support.";

  const databaseSystems: HomeProduct[] = dbElevators
    .filter((elevator) => elevator.category.trim().toLowerCase() !== "spare parts")
    .map((elevator) => ({
        series: `SERIES ${elevator.category.toUpperCase().slice(0, 8)}`,
        title: elevator.title,
        desc: elevator.description,
        specs: elevator.specifications || "Engineered precision specification",
        image: getElevatorProductAsset(elevator.title, elevator.category).src,
        fallbackImage: elevator.imageUrl,
        href: `/elevators/${categoryToSlug(elevator.category)}`,
      }));
  const requiredSystemMatches = [/home|residential/i, /passenger|commercial/i, /hospital|medical/i, /escalator|moving walk/i];
  const selectedDatabaseSystems = requiredSystemMatches.map((matcher, index) =>
    databaseSystems.find((system) => matcher.test(system.title)) || defaultSystems[index]
  );
  const systems: HomeProduct[] = dbElevators.length > 0
    ? [
        ...selectedDatabaseSystems,
        ...databaseSystems.filter((system) => !requiredSystemMatches.some((matcher) => matcher.test(system.title))),
      ]
    : defaultSystems;
  const projects: HomeProject[] = dbProjects.map((project) => ({
    projectName: project.projectName,
    imageUrl: project.imageUrl,
    projectType: project.projectType,
    location: project.location,
    href: `/projects/${project.id}`,
    category: project.projectType.toLowerCase().includes("residential")
      ? "Residential"
      : project.projectType.toLowerCase().includes("transit") || project.projectType.toLowerCase().includes("escalator")
        ? "Public / Transit"
        : "Commercial",
    elevatorCount: project.elevatorCount,
    featured: project.featured,
    status: project.status,
  }));
  const promotion: HomePromotion = {
    title: "Custom solutions",
    description: "Have a unique architectural vision? We fabricate bespoke panoramic glass capsules, low-pit configurations, and custom car interiors to architect drawings.",
    features: ["Curved glass capsules", "Low-pit shafts from 300 mm", "Smart destination dispatch"],
    image: bespokeFallbackImage.src,
  };
  const yearsInOperation = new Date().getFullYear() - 2016;

  return (
    <main className="font-sans tracking-normal text-[#0F0F0F]">
      <div className="relative isolate bg-[#0F0F0F]">
        <section className="sticky top-0 z-0 h-svh w-screen overflow-hidden bg-[#0F0F0F] text-white">
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[#0F0F0F]/35" />
          </div>
          <div className="relative z-10 mx-auto grid h-full w-full max-w-[1280px] grid-cols-1 items-center px-4 sm:px-6 lg:px-8">
            <div className="py-12 md:py-0">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">{heroBadge}</p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-normal sm:text-5xl md:text-6xl lg:text-7xl">{heroTitle}</h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 md:text-base">{heroBody}</p>
              <Link href="#contact" className="mt-8 inline-flex h-14 items-center justify-center border border-white bg-white px-7 text-sm font-semibold text-[#0F0F0F] transition-colors hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white">
                Get Started <ArrowRight aria-hidden="true" className="ml-3 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        <div className="relative z-10">
          <HomeMetricTransition yearsInOperation={yearsInOperation} />
        </div>
      </div>

      <HomeLandingSections systems={systems} projects={projects} promotion={promotion} />

      <section className="bg-white py-20 font-sans tracking-normal md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-12 max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Common inquiries</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">Frequently asked questions</h2>
          </div>
          <div className="mx-auto max-w-4xl space-y-4">
            {faqs.map((faq, index) => (
              <details key={faq.q} data-home-reveal className="home-reveal group" style={{ transitionDelay: `${index * 70}ms` }}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 border-b border-[#E5E5E5] py-5">
                  <span className="text-base font-semibold text-[#0F0F0F] transition-colors group-hover:text-[#2563EB] sm:text-lg">{faq.q}</span>
                  <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="border-b border-[#E5E5E5] py-5 text-sm leading-7 text-neutral-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#F5F5F3] py-20 font-sans tracking-normal md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Consultation and quote</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">Let’s plan your next lift.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">Share a few project details and our engineers will help define the right system and next steps.</p>
          </div>
          <div data-home-reveal className="home-reveal mx-auto max-w-4xl border border-[#E5E5E5] bg-white p-6 sm:p-8 md:p-10">
            <div className="mb-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-b border-[#E5E5E5] pb-5 text-center text-xs text-neutral-600">
              <span><strong className="font-semibold text-[#0F0F0F]">Based in</strong> Kilimani, Nairobi</span>
              <span><strong className="font-semibold text-[#0F0F0F]">Response</strong> within one business day</span>
              <span><strong className="font-semibold text-[#0F0F0F]">Emergency</strong> 24/7 standby</span>
            </div>
            <HomeContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}