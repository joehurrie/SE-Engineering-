import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench, Zap, Settings, CheckCircle2 } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lift Services",
  description:
    "Comprehensive lift services: genuine spare parts supply, elevator modernization, and custom engineering solutions in Kenya.",
};

const defaultServices = [
  {
    slug: "spare-parts",
    num: "01",
    icon: Wrench,
    title: "Spare Parts Supply",
    tagline: "Genuine OEM Component Inventory",
    desc: "We maintain a comprehensive inventory of genuine factory-certified components for all major elevator brands. From emergency breakdown response to scheduled overhauls, our rapid parts network minimizes equipment downtime.",
    features: [
      "Authentic OEM components with test certs",
      "Emergency 24/7 parts dispatch in Nairobi",
      "All major traction machine brands supported",
      "Expert diagnostic parts identification",
      "Nationwide East Africa delivery network",
      "Warranty backed components",
    ],
    img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "lift-modernization",
    num: "02",
    icon: Zap,
    title: "Lift Modernization",
    tagline: "Upgrade for Safety, Ride Quality & Energy Efficiency",
    desc: "Transform aging, energy-consuming elevator systems into quiet, modern architectural assets. We upgrade microprocessor controllers, install regenerative VVVF drives, and modernize cabin aesthetics to international standards.",
    features: [
      "Microprocessor VVVF controller overhauls",
      "Energy regenerative PMSM drive retrofits",
      "Architectural cabin interior refurbishment",
      "BS EN 81 safety compliance updates",
      "Reduced wait times and intelligent dispatch",
      "Minimal disruption staged modernization",
    ],
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "solution-customization",
    num: "03",
    icon: Settings,
    title: "Solution Customization",
    tagline: "Tailored Architectural & Industrial Engineering",
    desc: "Every architectural design has unique structural parameters. Our engineering department designs bespoke shaft configurations, curved glass observation panoramic elevators, and heavy industrial freight mechanisms tailored to your building blueprint.",
    features: [
      "Bespoke structural shaft design & engineering",
      "Custom curved glass & timber cab finishes",
      "Non-standard payload & dimension engineering",
      "Seamless architectural building integration",
      "Retrofitting in existing structures without major civil work",
      "Full engineering documentation & sign-off",
    ],
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
  },
];

export default async function LiftServicesPage() {
  let services = defaultServices;

  try {
    const dbServices = await prisma.liftService.findMany({
      orderBy: { id: "asc" },
    });

    if (dbServices && dbServices.length > 0) {
      services = defaultServices.map((s) => {
        const match = dbServices.find(
          (d) =>
            d.category.toLowerCase().includes(s.title.toLowerCase()) ||
            s.title.toLowerCase().includes(d.category.toLowerCase()) ||
            d.title.toLowerCase().includes(s.title.toLowerCase())
        );
        if (match) {
          return {
            ...s,
            title: match.title,
            desc: match.description,
            img: match.imageUrl || s.img,
          };
        }
        return s;
      });
    }
  } catch (error) {
    console.error("Failed to fetch lift services:", error);
  }
  return (
    <div className="bg-white text-[#111111] min-h-screen">

      {/* ── 1. Hero: 50vh View Height (Centered) ───────────── */}
      <section className="min-h-[50vh] min-h-[50svh] min-h-[380px] pt-32 pb-16 relative overflow-hidden border-b border-neutral-900 flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1600"
            alt="Elevator Engineering Facility"
            className="w-full h-full object-cover brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            ENGINEERING &amp; LIFECYCLE
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white mb-2 text-center">
            Lift Services.
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-4" />
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
            Beyond installation, Specialized Engineering supports your vertical assets across their entire operational lifecycle: 
            genuine OEM parts supply, state-of-the-art modernization, and bespoke architectural adaptations.
          </p>
        </div>
      </section>

      {/* ── 2. Services Sections (Nexia Alternating Layout) ─────── */}
      {services.map((service, idx) => (
        <section
          key={service.slug}
          className={`w-full min-h-[75vh] md:min-h-screen py-32 md:py-48 flex items-center justify-center ${
            idx % 2 === 0 ? "bg-white" : "bg-neutral-50"
          } border-b border-neutral-200`}
        >
          <div className="w-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            {/* Centered Section Header */}
            <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-20 md:mb-24">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="font-mono text-xs font-bold text-white bg-blue-600 px-3 py-1">
                  SE-{service.num}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold">
                  {service.tagline}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black mb-5 text-center">
                {service.title}
              </h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto mb-8" />
              <p className="text-neutral-600 text-base md:text-lg leading-relaxed font-light text-center">
                {service.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
              {/* Features Column */}
              <div className={`lg:col-span-6 space-y-8 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-4 p-7 md:p-8 rounded-none bg-white border border-neutral-200 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-neutral-800 text-sm font-medium leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-6 flex justify-center lg:justify-start">
                  <Link
                    href={`/lift-services/${service.slug}`}
                    className="h-14 px-8 bg-black hover:bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 rounded-none transition-colors"
                  >
                    <span>Learn More About {service.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Image Column */}
              <div className={`lg:col-span-6 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="relative rounded-none overflow-hidden shadow-2xl border-[16px] border-neutral-100">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-80 sm:h-[460px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-6 right-6 bg-blue-600 text-white px-5 py-2.5 text-xs font-bold z-20">
                    {service.title.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── 3. Consultation CTA ───────────────────────────────── */}
      <section className="w-full min-h-[50vh] bg-black py-32 md:py-44 text-center relative overflow-hidden flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-8">
          <div className="inline-block px-3 py-1 bg-neutral-900 text-neutral-400 text-[10px] font-bold uppercase tracking-widest border border-neutral-800">
            Rapid Technical Dispatch
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight text-center">
            Need Expert Lift Support or Modernization?
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto" />
          <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed text-center">
            Contact our certified engineering department in Kilimani for a free technical assessment and tailored proposal.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/contact"
              className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 rounded-none transition-colors"
            >
              <span>Request Service Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
