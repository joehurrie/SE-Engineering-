import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import prisma from "@/lib/prisma";
import { categoryToSlug } from "@/lib/slugs";
import HomeContactForm from "@/components/HomeContactForm";

import HomeLandingSections, {
  HomeMetricTransition,
  type HomeProduct,
  type HomeProject,
  type HomePromotion,
} from "@/components/HomeLandingSections";
import type { ElevatorProduct, Project, SiteContent } from "@prisma/client";
import type { Metadata } from "next";
import { getHomeContentMap } from "@/lib/home-content";

export const dynamic = "force-dynamic";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.specializedengineeringltd.co.ke";

export const metadata: Metadata = {
  title: "Elevator & Lift Solutions in Kenya | Specialized Engineering",
  description:
    "Kenya's leading elevator company. 200+ installations since 2016. Passenger elevators, home lifts, hospital elevators, escalators, and modernization — Nairobi & East Africa.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    title: "Specialized Engineering Kenya Ltd. | Elevator & Lift Solutions",
    description:
      "200+ elevators installed since 2016. Passenger elevators, home lifts, escalators, hospital lifts, and lift modernization across Kenya and East Africa.",
    images: [{ url: `${SITE_URL}/og-image.jpeg`, width: 1200, height: 630 }],
  },
};

const defaultSystems: HomeProduct[] = [
  {
    series: "SERIES PASSENGE",
    title: "Prestige Villa Home Lift",
    desc: "Ultra-quiet residential hydraulic and traction home lift engineered for private villas.",
    specs: "{\"capacity\":\"630kg\",\"speed\":\"1.0m/s\",\"stops\":\"2-5\"}",
    image: "https://exuu3jqec7sgqazh.public.blob.vercel-storage.com/uploads/1791926331777-design2.webp",
    href: "/elevators/home-lift",
  },
  {
    series: "SERIES PASSENGE",
    title: "Commercial High-Rise Passenger Elevator",
    desc: "High-capacity, smooth-ride passenger lifts engineered for commercial towers, hotels, and luxury multi-family developments with intelligent group dispatching.",
    specs: "{\"capacity\":\"630kg - 1600kg (8-21 Passengers)\",\"speed\":\"1.0m/s - 4.0m/s\",\"drive\":\"Permanent Magnet Synchronous Machine (PMSM)\",\"control\":\"Microprocessor VVVF Full Collective Group Control\"}",
    image: "https://exuu3jqec7sgqazh.public.blob.vercel-storage.com/uploads/1791836306273-dsc01710.webp",
    href: "/elevators/passenger-elevator",
  },
  {
    series: "SERIES HOSPITAL",
    title: "Medical Stretcher & Bed Hospital Elevator",
    desc: "Spacious, micro-leveling precision elevators designed specifically for medical facilities, hospital beds, delicate equipment, and intensive care transport.",
    specs: "{\"capacity\":\"1600kg - 2500kg\",\"speed\":\"1.0m/s - 2.0m/s\",\"doorClearance\":\"1200mm - 1500mm Telescopic / Center Open\",\"features\":\"Antibacterial finishes, Priority Medical Emergency Dispatch\"}",
    image: "https://exuu3jqec7sgqazh.public.blob.vercel-storage.com/uploads/1791836420088-dsc01729.webp",
    href: "/elevators/hospital-elevator",
  },
  {
    series: "SERIES E-400",
    title: "Escalators",
    desc: "High-capacity people movement for retail, hospitality, and public transport environments.",
    specs: "Public spaces · Heavy transit duty",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=85&w=1400",
    href: "/elevators/escalator-moving-walk",
  },
  {
    series: "SERIES PANORAMI",
    title: "Scenic Curved Glass Panoramic Elevator",
    desc: "Architectural observation lift with laminated safety curved glass walls, circular or diamond car profile, offering 180° to 360° exterior city and atrium views.",
    specs: "{\"capacity\":\"800kg - 1350kg (10-18 Passengers)\",\"speed\":\"1.0m/s - 2.5m/s\",\"carStyle\":\"Curved Glass / Hexagonal / Diamond\",\"illumination\":\"Ambient LED Concealed Lighting\"}",
    image: "https://exuu3jqec7sgqazh.public.blob.vercel-storage.com/uploads/1791836382007-dsc01833.webp",
    href: "/elevators/panoramic-elevator",
  },
  {
    series: "SERIES DUMBWAIT",
    title: "Commercial & Hospitality Service Dumbwaiter",
    desc: "Stainless steel grade 304 food and service dumbwaiters for restaurants, hotels, banks, and healthcare facilities with heating and multi-shelf configurations.",
    specs: "{\"capacity\":\"100kg - 300kg\",\"speed\":\"0.4m/s\",\"material\":\"Food-Grade Stainless Steel SUS304\",\"doors\":\"Bi-parting Vertical Sliding Shutter\"}",
    image: "https://exuu3jqec7sgqazh.public.blob.vercel-storage.com/uploads/1791836473398-dsc01709.webp",
    href: "/elevators/dumbwaiter",
  },
  {
    series: "SERIES HYDRAUL",
    title: "3-1 Lift",
    desc: "Description goes here",
    specs: "max capacity 300kgs",
    image: "https://exuu3jqec7sgqazh.public.blob.vercel-storage.com/uploads/1791883873151-dsc01702.webp",
    href: "/elevators/hydraulic-platform",
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

const heroFallback = {
  subtitle: "Kenya's Premier Elevator & Lift Engineering Partner",
  title: "Vertical Transportation Engineered for Excellence",
  bodyText: "Specialized Engineering Kenya Ltd. delivers world-class elevator design, installation, modernization, and 24/7 preventative maintenance across commercial, residential, and industrial developments in East Africa.",
};

function warnHomeFallback(section: string, reason: unknown) {
  const detail = reason instanceof Error ? reason.message : String(reason);
  console.warn(`Could not load live home ${section}; using defaults: ${detail}`);
}

function renderHeroTitle(title: string) {
  return <span className="text-white">{title}</span>;
}

export default async function HomePage() {
  let homeContentRecords: SiteContent[] = [];
  let dbElevators: ElevatorProduct[] = [];
  let dbProjects: Project[] = [];

  const [contentResult, elevatorsResult, projectsResult] = await Promise.allSettled([
    prisma.siteContent.findMany({ where: { sectionKey: { startsWith: "home_" } } }),
    prisma.elevatorProduct.findMany({ orderBy: { id: "asc" } }),
    prisma.project.findMany({ orderBy: { id: "asc" } }),
  ]);

  if (contentResult.status === "fulfilled") {
    homeContentRecords = contentResult.value;
  } else {
    warnHomeFallback("homepage content", contentResult.reason);
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

  const content = getHomeContentMap(homeContentRecords);
  const heroContent = content.home_hero;
  const heroImage = heroContent?.imageUrl || "/assets/home.jpeg";
  const heroBadge = heroContent?.subtitle || heroFallback.subtitle;
  const heroTitle = heroContent?.title || heroFallback.title;
  const heroBody = heroContent?.bodyText || heroFallback.bodyText;

  const featuredDbElevators = dbElevators.filter(
    (elevator) => elevator.category.trim().toLowerCase() !== "spare parts" && elevator.featured
  );
  const eligibleElevators = featuredDbElevators.length > 0
    ? featuredDbElevators
    : dbElevators.filter((elevator) => elevator.category.trim().toLowerCase() !== "spare parts");

  const databaseSystems: HomeProduct[] = eligibleElevators.map((elevator) => ({
    series: `SRS · ${elevator.category}`,
    title: elevator.title,
    desc: elevator.description,
    specs: elevator.specifications || "Engineered precision specification",
    image: elevator.imageUrl,
    href: `/elevators/${categoryToSlug(elevator.category)}`,
    featured: elevator.featured,
  }));
  const systems: HomeProduct[] = databaseSystems.length > 0 ? databaseSystems : defaultSystems;

  // Selected projects should strictly only show featured projects
  const eligibleProjects = dbProjects.filter(
    (project) => Boolean(project.featured) && Boolean(project.imageUrl && project.imageUrl.trim())
  );

  const projects: HomeProject[] = eligibleProjects.map((project) => ({
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
    title: content.home_video_banner?.title || "Elevator solutions, engineered for every journey.",
    description: content.home_video_banner?.bodyText || "From a single home lift to high-capacity commercial systems, we tailor complete vertical transport solutions to the people and places they serve.",
    features: ["Curved glass capsules", "Low-pit shafts from 300 mm", "Smart destination dispatch"],
    video: "/assets/video.mp4",
  };
  const homepageFaqs = faqs.map((faq, index) => ({
    q: content.home_faq?.[`question${index + 1}`] || faq.q,
    a: content.home_faq?.[`answer${index + 1}`] || faq.a,
  }));
  return (
    <div className="font-sans tracking-normal text-[#0F0F0F]">
      {/* Hero */}
      <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#0F0F0F] flex items-center">
        <div className="absolute inset-0">
          <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 flex items-center">
          <div className="max-w-3xl overflow-hidden my-auto">
            <p className="mb-5 inline-flex items-center gap-2 border border-white/40 bg-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-sm">
              <span className="h-1.5 w-1.5 bg-white" />
              {heroBadge}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {renderHeroTitle(heroTitle)}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
              {heroBody}
            </p>
            <Link
              href={heroContent?.buttonHref || "#contact"}
              className="mt-8 inline-flex h-14 items-center justify-center rounded-none border border-neutral-900 bg-neutral-950 px-8 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:border-[#2563EB] hover:bg-[#2563EB] active:bg-[#2563EB]"
            >
              {heroContent?.buttonLabel || "Get Started"} <ArrowRight aria-hidden="true" className="ml-3 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <HomeMetricTransition content={content.home_metrics} />

      <HomeLandingSections
        systems={systems}
        promotion={promotion}
        projects={projects}
        content={content}
      />

      <section className="bg-white py-20 font-sans tracking-normal md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-12 max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">{content.home_faq?.subtitle || "Common inquiries"}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">{content.home_faq?.title || "Frequently asked questions"}</h2>
          </div>
          <div className="mx-auto max-w-4xl space-y-4">
            {homepageFaqs.map((faq, index) => (
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">{content.home_contact?.subtitle || "Consultation and quote"}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">{content.home_contact?.title || "Let’s plan your next lift."}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">{content.home_contact?.bodyText || "Share a few project details and our engineers will help define the right system and next steps."}</p>
          </div>
          <div data-home-reveal className="home-reveal mx-auto max-w-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8 md:p-10">
            <HomeContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}