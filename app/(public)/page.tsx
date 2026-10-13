import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Building2,
  Clock,
  Award,
  Headphones,
  Quote,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { categoryToSlug } from "@/lib/slugs";
import HomeContactForm from "@/components/HomeContactForm";
import type { ElevatorProduct, Project, SiteContent } from "@prisma/client";

export const dynamic = "force-dynamic";

const defaultElevatorSystems = [
  {
    series: "SERIES P-800",
    title: "Passenger Elevators",
    desc: "High-efficiency gearless PMSM vertical transit engineered for commercial towers and residential complexes.",
    specs: "Speed up to 4.0 m/s · Capacity 630 kg – 1600 kg",
    image: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=800",
    href: "/elevators/passenger-elevator",
    isCustom: false,
  },
  {
    series: "SERIES H-300",
    title: "Luxury Home Lifts",
    desc: "Whisper-quiet villa elevators with minimal 300 mm pit depth, single-phase power options, and panoramic glass cabins.",
    specs: "Pit depth 300 mm · Minimal headroom · 3–5 Passengers",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=800",
    href: "/elevators/home-lift",
    isCustom: false,
  },
  {
    series: "SERIES G-600",
    title: "Panoramic Elevators",
    desc: "Scenic circular or diamond laminated glass observation capsules providing stunning atrium views.",
    specs: "180° – 360° Viewing · Custom illuminated car interiors",
    image: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=800",
    href: "/elevators/panoramic-elevator",
    isCustom: false,
  },
  {
    series: "SERIES E-400",
    title: "Escalators & Moving Walks",
    desc: "Heavy-duty commercial transit escalators engineered for heavy pedestrian traffic flows in retail centers and transit hubs.",
    specs: "30° / 35° Inclination · Energy saving frequency inverter",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=80&w=800",
    href: "/elevators/escalator-moving-walk",
    isCustom: false,
  },
  {
    series: "SERIES F-1000",
    title: "Freight & Hospital Elevators",
    desc: "Reinforced checkered steel platform flooring and micro-leveling precision specifically proportioned for heavy loads and medical beds.",
    specs: "Capacity up to 10,000 kg · Reinforced bi-parting doors",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
    href: "/elevators/freight-car-elevator",
    isCustom: false,
  },
];

const faqs = [
  {
    q: "How long does a commercial or residential elevator installation take?",
    a: "Standard residential villa lifts take 3 to 4 weeks for shaft installation and commissioning once civil shaft work is complete. Commercial high-rise installations typically span 6 to 10 weeks depending on floor count and speed configurations.",
  },
  {
    q: "What is covered under your 10-Year Workmanship Guarantee?",
    a: "Our warranty covers all structural anchoring, guide rail alignments, traction machine mounts, and electrical wiring integrity against manufacturing or installation defects, backed by scheduled quarterly maintenance inspections.",
  },
  {
    q: "Do you supply genuine OEM spare parts for other elevator brands?",
    a: "Yes. In addition to being the exclusive XIZI partner in Kenya, we maintain a comprehensive inventory of genuine factory-certified traction cables, electronic boards, door operators, and safety gears in our Nairobi hub.",
  },
  {
    q: "How does the 24/7 emergency dispatch service operate?",
    a: "We maintain dedicated standby engineering crews stationed across Kilimani, Westlands, and Upper Hill. In the event of an unexpected fault, our technicians dispatch immediately with an average response time under 30 minutes in Nairobi.",
  },
];

export default async function HomePage() {
  let heroContent: SiteContent | null = null;
  let dbElevators: ElevatorProduct[] = [];
  let dbProjects: Project[] = [];

  try {
    const [heroRes, elevatorsRes, projectsRes] = await Promise.all([
      prisma.siteContent.findUnique({ where: { sectionKey: "home_hero" } }),
      prisma.elevatorProduct.findMany({ orderBy: { id: "asc" } }),
      prisma.project.findMany({ orderBy: { id: "asc" } }),
    ]);
    heroContent = heroRes;
    dbElevators = elevatorsRes || [];
    dbProjects = projectsRes || [];
  } catch (error) {
    console.error("Failed to load live home data:", error);
  }

  // Hero fields
  const heroImage =
    heroContent?.imageUrl ||
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2600&auto=format&fit=crop";
  const heroBadge = heroContent?.subtitle || "PREMIER VERTICAL ENGINEERING";
  const heroTitle = heroContent?.title || "ENGINEERED PERFECTION.";
  const heroBody =
    heroContent?.bodyText ||
    "High-performance elevator systems engineered for modern architecture. Exclusive XIZI partner delivering ISO safety, German-standard traction, and 24/7 Nairobi support.";

  // Systems cards
  let displaySystems: Array<{
    id?: number;
    series: string;
    title: string;
    desc: string;
    specs: string;
    image: string;
    href: string;
  }> = [];
  if (dbElevators.length > 0) {
    displaySystems = dbElevators.map((e) => ({
      id: e.id,
      series: `SERIES ${e.category.toUpperCase().slice(0, 8)}`,
      title: e.title,
      desc: e.description,
      specs: e.specifications || "Engineered Precision Specification",
      image: e.imageUrl,
      href: `/elevators/${categoryToSlug(e.category)}`,
    }));
  } else {
    displaySystems = defaultElevatorSystems;
  }

  const spotlightProject = dbProjects[0];
  const customSolution = {
    title: "Custom Solutions",
    description:
      "Have a unique architectural vision? We fabricate bespoke panoramic glass capsules, low-pit configurations, and custom car interiors to architect drawings.",
    features: [
      "Curved glass capsules",
      "Low-pit shafts from 300 mm",
      "Smart destination dispatch",
    ],
    image: defaultElevatorSystems[2].image,
  };

  return (
    <div className="w-full bg-white text-neutral-900 antialiased selection:bg-blue-600 selection:text-white">

      {/* ══ 1. HERO SECTION (100vh) ═════════════════════════════════════ */}
      <section className="relative min-h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Modern Vertical Transportation Facade"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="section-shell relative z-10 flex min-h-screen items-center justify-center">
          <div className="mx-auto max-w-5xl py-24 text-center text-white md:py-28">
            <div className="mb-8 inline-flex items-center gap-2 border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
              {heroBadge}
            </div>

            <h1 className="mb-7 text-5xl font-bold tracking-[-0.06em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
              {heroTitle}
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-200 md:text-xl">
              {heroBody}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/elevators"
                className="inline-flex h-14 items-center justify-center rounded-none bg-blue-600 px-8 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-blue-500"
              >
                View Catalog
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-none border border-white/20 bg-white px-8 text-sm font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:bg-neutral-100"
              >
                Get Engineering Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </section>

      {/* ══ 2. STATS SECTION (50vh) ═════════════════════════════════════ */}
      <section className="w-full bg-black py-16 text-white md:py-20">
        <div className="section-shell">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            <div className="flex flex-col items-center justify-center space-y-3 border border-white/10 bg-white/3 p-6 text-center">
              <div className="font-mono text-4xl font-bold text-blue-500 sm:text-5xl">200+</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Installations</div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-3 border border-white/10 bg-white/3 p-6 text-center">
              <div className="font-mono text-4xl font-bold text-blue-500 sm:text-5xl">30+</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Experts</div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-3 border border-white/10 bg-white/3 p-6 text-center">
              <div className="font-mono text-4xl font-bold text-blue-500 sm:text-5xl">10Y</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Warranty</div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-3 border border-white/10 bg-white/3 p-6 text-center">
              <div className="font-mono text-4xl font-bold text-blue-500 sm:text-5xl">24/7</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. OUR PROCESS (full width, minimal flow) ═════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="section-shell">
          <div className="mb-14 text-center">
            <div className="inline-block border border-neutral-200 bg-neutral-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">
              Our Process
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.05em] text-black sm:text-4xl md:text-5xl">
              A clear path from design to delivery.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Assess", text: "We review shaft dimensions, traffic flow, and architectural fit before any design is signed off." },
              { title: "Engineer", text: "Our technical specialists select the right system, cabin, control logic, and safety parameters for your project." },
              { title: "Deliver", text: "Installation, commissioning, inspection, and long-term support are managed as one seamless project." },
            ].map((step, idx) => (
              <div key={step.title} className="border border-neutral-200 bg-neutral-50 p-8 text-left shadow-[0_8px_24px_rgba(15,23,42,0.02)]">
                <div className="mb-5 flex h-10 w-10 items-center justify-center border border-blue-200 bg-blue-50 text-sm font-bold text-blue-600">
                  0{idx + 1}
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-[-0.04em] text-black">{step.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. FULFILL YOUR VISION (75vh, Centered Minimal Statement) ══ */}
      <section
        id="vision"
        className="w-full min-h-[70vh] md:min-h-[80vh] bg-white border-b border-neutral-100 flex items-center justify-center py-28 md:py-40"
      >
        <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center space-y-10">
          <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-widest border border-neutral-200">
            Fulfil Your Vision
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-snug text-center max-w-3xl">
            &ldquo;Specialized Engineering is committed to providing the highest engineering rigor in meeting your vertical transportation needs for the future.&rdquo;
          </h2>

          <div className="w-20 h-1 bg-blue-600 mx-auto" />

          <div className="flex flex-col items-center justify-center gap-3 text-center pt-2">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-sm">
              SE
            </div>
            <div>
              <p className="text-base font-bold text-black uppercase tracking-wider">
                Specialized Engineering Kenya Ltd.
              </p>
              <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono mt-0.5">
                Kilimani Business Hub, Nairobi · Founded 2016
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. SYSTEMS GRID (100vh, Substantial Breathing Room) ═══════ */}
      <section id="products" className="w-full bg-neutral-50 py-20 md:py-28">
        <div className="section-shell flex flex-col items-center">
          {/* Centered Section Header */}
          <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center justify-center text-center md:mb-14">
            <div className="inline-block px-3.5 py-1.5 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-5 border border-neutral-200">
              System Range
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight mb-5 text-center">
              Our Systems
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8" />
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed text-center max-w-xl mx-auto font-light">
              We engineer and install precision vertical transport solutions tailored to your specific architectural shafts, ensuring whisper-quiet operation and safety.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {displaySystems.map((item, idx) => (
                <div
                  key={item.id ? `elevator-card-${item.id}` : `system-card-${item.title}-${idx}`}
                  className="group relative flex min-h-[500px] flex-col overflow-hidden border border-neutral-200 bg-white text-center transition-colors duration-300 hover:border-neutral-400"
                >
                  <div className="relative h-64 overflow-hidden sm:h-72">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-colors group-hover:from-black/10" />
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-between space-y-6 p-6 text-center md:p-8">
                    <div className="flex w-full flex-col items-center space-y-4 text-center">
                      <div className="flex items-center justify-center gap-2.5">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                          {item.series}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold tracking-[-0.05em] text-black sm:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mx-auto max-w-sm text-sm leading-relaxed text-neutral-600 md:text-[15px]">
                        {item.desc}
                      </p>
                    </div>
                    <Link
                      href={item.href}
                      className="inline-flex w-full items-center justify-center gap-2 border-t border-neutral-100 pt-5 text-sm font-semibold text-black transition-colors hover:text-blue-600"
                    >
                      <span>Explore Specs</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="section-shell">
          <div className="grid overflow-hidden bg-neutral-950 text-white lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-center px-7 py-10 sm:px-10 md:px-14 md:py-14">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                Beyond the standard range
              </p>
              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl md:text-5xl">
                {customSolution.title}, engineered around your architecture.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-300 md:text-base">
                {customSolution.description}
              </p>
              <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {customSolution.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-neutral-200">
                    <span className="h-1.5 w-1.5 shrink-0 bg-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-9 inline-flex h-14 w-fit items-center gap-3 bg-white px-6 text-xs font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-neutral-200"
              >
                Discuss a bespoke project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-64 lg:min-h-[480px]">
              <img
                src={customSolution.image}
                alt="Architectural panoramic elevator installation"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 5. WHY CHOOSE US / THE SE STANDARD (100vh, Clean 2-Col) ════ */}
      <section className="w-full min-h-screen bg-white border-y border-neutral-100 flex items-center justify-center py-32 md:py-48">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
          {/* Centered Section Header */}
          <div className="flex flex-col items-center justify-center text-center mb-24 md:mb-28 max-w-3xl mx-auto">
            <div className="inline-block px-3.5 py-1.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-5 border border-neutral-200">
              The SE Standard
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight mb-5 text-center">
              Redefining Installation Precision
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8" />
            <p className="text-neutral-600 text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto font-light">
              Most elevator companies outsource installation and shaft alignment. We don&rsquo;t. Our in-house technical corps ensures the gap between factory engineering precision and on-site reality is zero.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
            <div className="space-y-8">
              <div className="flex gap-6 p-10 md:p-14 bg-neutral-50 border border-neutral-200">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold tracking-[-0.04em] text-black">Certified Factory Systems</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                    Direct XIZI manufacturer partnership with genuine factory ISO certificates and zero middleman markups.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 p-10 md:p-14 bg-neutral-50 border border-neutral-200">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold tracking-[-0.04em] text-black">On-Time Commissioning</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                    Standardized shaft assembly protocols ensuring strict adherence to developer delivery milestones.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 p-10 md:p-14 bg-neutral-50 border border-neutral-200">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold tracking-[-0.04em] text-black">24/7 Rapid Emergency Response</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">
                    10-year structural warranty on workmanship and under 30-minute standby engineering crews in Nairobi.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-none overflow-hidden shadow-2xl border-[16px] border-neutral-100">
                <img
                  src={spotlightProject?.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop"}
                  alt={spotlightProject?.projectName || "Alina Harbor Towers Project"}
                  className="w-full h-[460px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-6 right-6 bg-blue-600 text-white px-5 py-2.5 text-xs font-bold z-20">
                  PROJECT: {spotlightProject?.projectName.toUpperCase() || "ALINA HARBOR TOWERS"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. TESTIMONIALS (Responsive, airy minimal layout) ═══════════ */}
      <section className="w-full bg-neutral-50 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl px-6 text-center">
          <div className="mx-auto mb-16 md:mb-20 max-w-3xl text-center">
            <div className="inline-block px-3.5 py-1.5 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-5 border border-neutral-200">
              Client Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 text-center tracking-tight">
              Trusted by Professionals
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>

          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            <div className="flex flex-col items-center justify-between border border-neutral-200 bg-white p-7 text-center md:p-9">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex justify-center text-blue-600">
                  <Quote className="h-8 w-8" />
                </div>
                <p className="mb-8 text-[15px] leading-relaxed text-neutral-600 md:text-lg text-center">
                  &ldquo;Specialized Engineering installed 12 high-speed passenger elevators at Alina Harbor Towers on time. Their technical alignment and zero vibration ride quality is world-class.&rdquo;
                </p>
              </div>
              <div className="flex w-full flex-col items-center gap-3 border-t border-neutral-100 pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center bg-black text-sm font-bold text-white">
                  AK
                </div>
                <div>
                  <div className="text-base font-bold tracking-[-0.03em] text-black">Amit Kumar</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-500">Commercial Developer, Kilimani</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between border border-neutral-200 bg-white p-7 text-center md:p-9">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex justify-center text-black">
                  <Quote className="h-8 w-8" />
                </div>
                <p className="mb-8 text-[15px] leading-relaxed text-neutral-600 md:text-lg text-center">
                  &ldquo;As an architect, I need reliability in shaft dimensions and bespoke panoramic cab finishes. Specialized Engineering delivers exactly what is specified in our CAD drawings.&rdquo;
                </p>
              </div>
              <div className="flex w-full flex-col items-center gap-3 border-t border-neutral-100 pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center bg-blue-600 text-sm font-bold text-white">
                  SJ
                </div>
                <div>
                  <div className="text-base font-bold tracking-[-0.03em] text-black">Sarah Jenkins</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-500">Principal Architect, Nairobi</div>
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col items-center justify-between border border-neutral-200 bg-white p-7 text-center md:p-9">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex justify-center text-blue-600">
                  <Quote className="h-8 w-8" />
                </div>
                <p className="mb-8 text-[15px] leading-relaxed text-neutral-600 md:text-lg text-center">
                  &ldquo;The custom glass home lift in our Karen villa operates whisper-quiet and fits seamlessly with our double-height living room aesthetics. Highly recommended.&rdquo;
                </p>
              </div>
              <div className="flex w-full flex-col items-center gap-3 border-t border-neutral-100 pt-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center bg-black text-sm font-bold text-white">
                  RM
                </div>
                <div>
                  <div className="text-base font-bold tracking-[-0.03em] text-black">Rajesh M.</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-500">Private Villa Owner, Karen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 7. FAQ SECTION (75vh, Centered Minimal Accordion) ══════════ */}
      <section className="w-full border-t border-neutral-100 bg-white py-20 md:py-28">
        <div className="mx-auto w-full max-w-4xl px-6">
          <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center justify-center text-center md:mb-14">
            <div className="inline-block px-3.5 py-1.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-5 border border-neutral-200">
              Common Inquiries
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight text-center">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-5" />
          </div>

          <div className="w-full space-y-4 md:space-y-5">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border border-neutral-200 bg-neutral-50/50 p-5 md:p-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5">
                  <span className="text-base md:text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4" />
                </summary>
                <div className="mt-4 border-t border-neutral-200 pt-4 text-sm leading-relaxed text-neutral-600 md:mt-5 md:pt-5 md:text-base">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 8. CTA / CONTACT (100vh, Full-Screen Industrial Statement) ═ */}
      <section id="contact" className="w-full bg-neutral-50 py-20 md:py-28">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              Consultation &amp; quote
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-black sm:text-4xl md:text-5xl">
              Let&rsquo;s plan your next lift.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
              Share a few project details and our engineers will help define the right system and next steps.
            </p>
          </div>

          <div className="mx-auto max-w-4xl border border-neutral-200 bg-white p-6 sm:p-8 md:p-10">
            <div className="mb-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-b border-neutral-200 pb-5 text-center text-xs text-neutral-600">
              <span><strong className="font-semibold text-neutral-900">Based in</strong> Kilimani, Nairobi</span>
              <span><strong className="font-semibold text-neutral-900">Response</strong> within one business day</span>
              <span><strong className="font-semibold text-neutral-900">Emergency</strong> 24/7 standby</span>
            </div>
            <HomeContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
