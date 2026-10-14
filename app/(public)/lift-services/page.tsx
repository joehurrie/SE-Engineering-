import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import LiftServicesShowcase, {
  type LiftServiceContent,
  type LiftServicePart,
} from "@/components/LiftServicesShowcase";
import ScrollRevealPage from "@/components/ScrollRevealPage";
import { defaultSpareParts } from "@/lib/default-spare-parts";

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
  let services: LiftServiceContent[] = defaultServices;
  let spareParts: LiftServicePart[] = defaultSpareParts.map((part) => ({
    id: part.slug,
    title: part.title,
    description: part.description,
    image: part.imageUrl,
    href: `/elevators/spare-parts/${part.slug}`,
  }));

  try {
    const [dbServices, dbSpareParts] = await Promise.all([
      prisma.liftService.findMany({ orderBy: { id: "asc" } }),
      prisma.sparePartProduct.findMany({ orderBy: { id: "asc" } }),
    ]);

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

    const databaseSpareParts = dbSpareParts
      .map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.imageUrl,
        href: `/elevators/spare-parts/${product.slug}`,
      }));
    if (databaseSpareParts.length > 0) spareParts = databaseSpareParts;
  } catch (error) {
    console.error("Failed to fetch lift service content:", error);
  }
  return (
    <ScrollRevealPage className="bg-white text-[#111111] min-h-screen">

      {/* ── 1. Hero: 50vh View Height (Centered) ───────────── */}
      <section className="min-h-screen pt-32 pb-16 relative overflow-hidden border-b border-neutral-900 flex items-center justify-center bg-black">
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

      <LiftServicesShowcase services={services} spareParts={spareParts} />

      {/* ── 3. Consultation CTA ───────────────────────────────── */}
      <section className="w-full min-h-[50vh] bg-neutral-100 py-32 md:py-44 text-center relative overflow-hidden flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-8">
          <div className="inline-block px-3 py-1 bg-white text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-neutral-200">
            Rapid Technical Dispatch
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 uppercase tracking-tight text-center">
            Need Expert Lift Support or Modernization?
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto" />
          <p className="text-neutral-600 text-sm md:text-base font-light leading-relaxed text-center">
            Contact our certified engineering department in Kilimani for a free technical assessment and tailored proposal.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/contact"
              className="h-14 px-8 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 rounded-none transition-colors"
            >
              <span>Request Service Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </ScrollRevealPage>
  );
}
