import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Building2,
  Clock,
  Layers,
  Award,
  Headphones,
  Quote,
  CheckCircle2,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { categoryToSlug } from "@/lib/slugs";
import HomeContactForm from "@/components/HomeContactForm";

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
  let heroContent = null;
  let dbElevators: any[] = [];
  let dbProjects: any[] = [];

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
  let displaySystems: any[] = [];
  if (dbElevators.length > 0) {
    displaySystems = dbElevators.map((e) => ({
      id: e.id,
      series: `SERIES ${e.category.toUpperCase().slice(0, 8)}`,
      title: e.title,
      desc: e.description,
      specs: e.specifications || "Engineered Precision Specification",
      image: e.imageUrl,
      href: `/elevators/${categoryToSlug(e.category)}`,
      isCustom: false,
    }));
  } else {
    displaySystems = defaultElevatorSystems;
  }

  // Inject custom bespoke card
  displaySystems.splice(2, 0, {
    isCustom: true,
    title: "Custom Solutions",
    desc: "Have a unique architectural vision? We fabricate bespoke panoramic glass capsules, low-pit configurations, and custom car interiors to architect drawings.",
    features: [
      "Curved Glass Capsules",
      "Low Pit Shafts (300 mm)",
      "Smart Destination Dispatch",
    ],
    href: "/contact",
    series: "",
    specs: "",
    image: "",
  });

  const spotlightProject = dbProjects[0];

  return (
    <div className="w-full bg-white text-neutral-900 antialiased selection:bg-blue-600 selection:text-white">

      {/* ══ 1. HERO SECTION (100vh, Minimal, Centered) ════════════════ */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-24 md:py-32">
        {/* Background Image with Hero Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Modern Vertical Transportation Facade"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Centered Content Container */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
            {heroBadge}
          </div>

          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8 leading-[1.08] animate-fade-in-up text-center"
            style={{ animationDelay: "0.1s" }}
          >
            {heroTitle.includes("<br") ? (
              heroTitle
            ) : (
              <>
                {heroTitle}
              </>
            )}
          </h1>

          <p
            className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up text-center"
            style={{ animationDelay: "0.2s" }}
          >
            {heroBody}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up w-full"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/elevators"
              className="h-14 px-10 bg-blue-600 text-white text-sm font-semibold uppercase tracking-wider hover:bg-blue-700 transition-colors w-full sm:w-auto flex items-center justify-center rounded-none"
            >
              View Catalog
            </Link>
            <Link
              href="/contact"
              className="h-14 px-10 bg-white text-black text-sm font-semibold uppercase tracking-wider hover:bg-neutral-100 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 rounded-none"
            >
              Get Engineering Quote
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* ══ 2. STATS SECTION (50vh, Minimal, Spacious) ═════════════════ */}
      <section className="w-full min-h-[50vh] bg-black text-white flex items-center justify-center py-24 md:py-32 relative z-20">
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="text-4xl sm:text-6xl lg:text-7xl font-bold text-blue-500 tracking-tight font-mono">
                200+
              </div>
              <div className="text-xs sm:text-sm text-neutral-400 uppercase tracking-widest font-medium">
                Installations Completed
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="text-4xl sm:text-6xl lg:text-7xl font-bold text-blue-500 tracking-tight font-mono">
                30+
              </div>
              <div className="text-xs sm:text-sm text-neutral-400 uppercase tracking-widest font-medium">
                Certified Engineers &amp; Techs
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="text-4xl sm:text-6xl lg:text-7xl font-bold text-blue-500 tracking-tight font-mono">
                10-Yr
              </div>
              <div className="text-xs sm:text-sm text-neutral-400 uppercase tracking-widest font-medium">
                Structural Warranty
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="text-4xl sm:text-6xl lg:text-7xl font-bold text-blue-500 tracking-tight font-mono">
                24/7
              </div>
              <div className="text-xs sm:text-sm text-neutral-400 uppercase tracking-widest font-medium">
                Nairobi Rapid Response
              </div>
            </div>
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
      <section
        id="products"
        className="w-full min-h-screen bg-neutral-50 flex items-center justify-center py-32 md:py-48"
      >
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
          {/* Centered Section Header */}
          <div className="flex flex-col items-center justify-center text-center mb-24 md:mb-28 max-w-3xl mx-auto">
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
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {displaySystems.map((item: any, idx: number) => {
              if (item.isCustom) {
                return (
                  <div
                    key="custom-solution-card"
                    className="group bg-black text-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden min-h-[640px] flex flex-col justify-between p-12 md:p-16 rounded-none text-center items-center"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <Layers className="w-48 h-48" />
                    </div>

                    <div className="relative z-10 space-y-6 flex flex-col items-center text-center w-full">
                      <div className="inline-block text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
                        Bespoke Fabrication
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
                        {item.title}
                      </h3>
                      <p className="text-neutral-400 leading-relaxed text-base font-light text-center max-w-sm mx-auto">
                        {item.desc}
                      </p>
                      <ul className="space-y-5 my-8 text-left inline-block mx-auto">
                        {item.features?.map((f: string) => (
                          <li key={f} className="flex items-center gap-4">
                            <div className="w-2 h-2 bg-blue-500 rounded-none shrink-0" />
                            <span className="text-sm font-medium">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative z-10 pt-8 w-full">
                      <Link
                        href={item.href}
                        className="w-full h-16 bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center text-xs rounded-none"
                      >
                        Consult Engineering
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id ? `elevator-card-${item.id}` : `system-card-${item.title}-${idx}`}
                  className="group bg-white border border-neutral-200 hover:border-blue-600/30 hover:shadow-2xl transition-all duration-300 relative overflow-hidden min-h-[640px] flex flex-col rounded-none text-center"
                >
                  <div className="h-64 sm:h-72 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="p-10 md:p-14 flex-1 flex flex-col justify-between space-y-8 items-center text-center">
                    <div className="space-y-5 flex flex-col items-center text-center w-full">
                      <div className="flex items-center justify-center gap-3">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 font-mono">
                          {item.series}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-black tracking-tight text-center">
                        {item.title}
                      </h3>
                      <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-light line-clamp-3 text-center max-w-sm mx-auto">
                        {item.desc}
                      </p>
                    </div>
                    <Link
                      href={item.href}
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-black hover:text-blue-600 transition-colors pt-8 border-t border-neutral-100 w-full"
                    >
                      <span>Explore Specs</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 5. WHY CHOOSE US / THE SE STANDARD (100vh, Clean 2-Col) ════ */}
      <section className="w-full min-h-screen bg-white border-y border-neutral-100 flex items-center justify-center py-32 md:py-48">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
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
                  <h4 className="text-xl font-bold text-black">Certified Factory Systems</h4>
                  <p className="text-sm text-neutral-500 mt-2 font-light leading-relaxed">
                    Direct XIZI manufacturer partnership with genuine factory ISO certificates and zero middleman markups.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 p-10 md:p-14 bg-neutral-50 border border-neutral-200">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-black">On-Time Commissioning</h4>
                  <p className="text-sm text-neutral-500 mt-2 font-light leading-relaxed">
                    Standardized shaft assembly protocols ensuring strict adherence to developer delivery milestones.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 p-10 md:p-14 bg-neutral-50 border border-neutral-200">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-black">24/7 Rapid Emergency Response</h4>
                  <p className="text-sm text-neutral-500 mt-2 font-light leading-relaxed">
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

      {/* ══ 6. TESTIMONIALS (80vh, Minimal Cards) ══════════════════════ */}
      <section className="w-full min-h-[80vh] bg-neutral-50 flex items-center justify-center py-32 md:py-48">
        <div className="w-full max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center justify-center text-center mb-24 md:mb-28 max-w-3xl mx-auto">
            <div className="inline-block px-3.5 py-1.5 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-5 border border-neutral-200">
              Client Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-5 text-center">
              Trusted by Professionals
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <div className="bg-white p-12 md:p-16 border-b-4 border-blue-600 shadow-sm text-center flex flex-col items-center justify-between">
              <div className="flex flex-col items-center text-center">
                <div className="text-blue-600 mb-8 flex justify-center">
                  <Quote className="w-9 h-9" />
                </div>
                <p className="text-neutral-600 text-base md:text-lg leading-relaxed mb-10 font-light text-center">
                  &ldquo;Specialized Engineering installed 12 high-speed passenger elevators at Alina Harbor Towers on time. Their technical alignment and zero vibration ride quality is world-class.&rdquo;
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 pt-8 border-t border-neutral-100 w-full">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-sm">
                  AK
                </div>
                <div>
                  <div className="text-black text-base font-bold">Amit Kumar</div>
                  <div className="text-neutral-500 text-xs mt-0.5">Commercial Developer, Kilimani</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 md:p-16 border-b-4 border-black shadow-sm text-center flex flex-col items-center justify-between">
              <div className="flex flex-col items-center text-center">
                <div className="text-black mb-8 flex justify-center">
                  <Quote className="w-9 h-9" />
                </div>
                <p className="text-neutral-600 text-base md:text-lg leading-relaxed mb-10 font-light text-center">
                  &ldquo;As an architect, I need reliability in shaft dimensions and bespoke panoramic cab finishes. Specialized Engineering delivers exactly what is specified in our CAD drawings.&rdquo;
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 pt-8 border-t border-neutral-100 w-full">
                <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  SJ
                </div>
                <div>
                  <div className="text-black text-base font-bold">Sarah Jenkins</div>
                  <div className="text-neutral-500 text-xs mt-0.5">Principal Architect, Nairobi</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 md:p-16 border-b-4 border-blue-600 shadow-sm text-center flex flex-col items-center justify-between">
              <div className="flex flex-col items-center text-center">
                <div className="text-blue-600 mb-8 flex justify-center">
                  <Quote className="w-9 h-9" />
                </div>
                <p className="text-neutral-600 text-base md:text-lg leading-relaxed mb-10 font-light text-center">
                  &ldquo;The custom glass home lift in our Karen villa operates whisper-quiet and fits seamlessly with our double-height living room aesthetics. Highly recommended.&rdquo;
                </p>
              </div>
              <div className="flex flex-col items-center text-center gap-3 pt-8 border-t border-neutral-100 w-full">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-sm">
                  RM
                </div>
                <div>
                  <div className="text-black text-base font-bold">Rajesh M.</div>
                  <div className="text-neutral-500 text-xs mt-0.5">Private Villa Owner, Karen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 7. FAQ SECTION (75vh, Centered Minimal Accordion) ══════════ */}
      <section className="w-full min-h-[75vh] bg-white border-t border-neutral-100 flex items-center justify-center py-32 md:py-48">
        <div className="w-full max-w-4xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center text-center mb-20 md:mb-24 max-w-3xl mx-auto">
            <div className="inline-block px-3.5 py-1.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-5 border border-neutral-200">
              Common Inquiries
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight text-center">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mt-5" />
          </div>

          <div className="w-full space-y-8">
            {faqs.map((faq) => (
              <details key={faq.q} className="group border border-neutral-200 p-10 md:p-14 bg-neutral-50/50">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-base md:text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4" />
                </summary>
                <div className="text-neutral-600 text-base md:text-lg leading-relaxed mt-6 pt-6 border-t border-neutral-200 font-light">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 8. CTA / CONTACT (100vh, Full-Screen Industrial Statement) ═ */}
      <section
        id="contact"
        className="w-full min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center py-32 md:py-48"
      >
        <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-600 clip-diagonal hidden md:block" />

        <div className="w-full max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center my-auto">
          <div className="inline-block px-3.5 py-1.5 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest mb-6">
            CONSULTATION &amp; QUOTE
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-center">
            Ready to upgrade?
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8" />
          <p className="text-neutral-300 text-lg md:text-xl mb-16 max-w-xl mx-auto font-light text-center leading-relaxed">
            Get a certified engineering consultation and shaft quote for your property.
            <span className="text-white block mt-2 font-medium">
              No hidden costs. Direct manufacturer precision.
            </span>
          </p>

          {/* Form Card Container */}
          <div className="w-full max-w-2xl mx-auto bg-[#141414] border border-white/10 p-12 sm:p-16 md:p-20 rounded-none shadow-2xl text-left space-y-10">
            <div className="border-b border-white/10 pb-8 space-y-2.5">
              <span className="text-xs font-mono tracking-widest text-blue-400 uppercase font-semibold block">
                Direct Engineering Dispatch
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                Request A Quote
              </h3>
              <p className="text-sm text-neutral-400 font-light">
                Direct consultation with our Nairobi technical team
              </p>
            </div>

            <HomeContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
