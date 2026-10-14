import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import ScrollRevealPage from "@/components/ScrollRevealPage";

const serviceData: Record<string, {
  title: string;
  tagline: string;
  description: string;
  details: string[];
  img: string;
}> = {
  "spare-parts": {
    title: "Spare Parts",
    tagline: "Genuine Component Supply & Emergency Dispatch",
    description: "Minimize elevator downtime with our comprehensive genuine spare parts inventory. We stock components for all major elevator brands and can dispatch emergency parts 24/7 across Kenya.",
    details: [
      "We maintain partnerships with leading global elevator component manufacturers to ensure you receive only genuine OEM-quality parts.",
      "Our inventory includes controllers, motors, door operators, safety gear, ropes, and all electrical components for major brands.",
      "Emergency 24/7 parts dispatch ensures your building's elevator is back in service as quickly as possible.",
      "All parts come with manufacturer warranties and our installation guarantee.",
    ],
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
  },
  "lift-modernization": {
    title: "Lift Modernization",
    tagline: "Upgrade Safety, Efficiency & Aesthetics",
    description: "Transform your aging elevator into a modern, energy-efficient, and safe system without the cost of complete replacement. Our modernization programs are tailored to your building's specific requirements.",
    details: [
      "Full controller replacement with state-of-the-art VVVF drives reduces energy consumption by up to 40%.",
      "Safety system upgrades ensure compliance with current EN 81 standards and local building codes.",
      "Cab interior refurbishment programs can completely transform the passenger experience.",
      "Our modernization projects are planned to minimize disruption with phased downtime schedules.",
    ],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200",
  },
  "solution-customization": {
    title: "Solution Customization",
    tagline: "Bespoke Engineering for Unique Requirements",
    description: "When standard elevator solutions don't fit your building's unique architecture or requirements, our engineering team designs custom solutions — from non-standard shaft dimensions to completely bespoke cabin aesthetics.",
    details: [
      "Our engineers assess your building's structural characteristics to design the optimal custom elevator solution.",
      "We handle all aspects of custom shaft design, including structural reinforcement and waterproofing.",
      "Bespoke cabin interiors can incorporate any material, finish, or design language to match your building's aesthetic.",
      "We provide complete project documentation including engineering drawings, safety certificates, and handover manuals.",
    ],
    img: "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1200",
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = serviceData[slug];
  if (!data) return { title: "Not Found" };
  return { title: data.title, description: data.description };
}

export async function generateStaticParams() {
  return Object.keys(serviceData).map((slug) => ({ slug }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = serviceData[slug];
  if (!data) notFound();

  return (
    <ScrollRevealPage className="bg-white text-[#111111] min-h-screen">
      {/* ── 1. Hero: 50vh View Height (Centered) ───────────── */}
      <section className="min-h-[50vh] min-h-[50svh] min-h-[380px] relative pt-32 pb-16 flex items-center justify-center overflow-hidden border-b border-black bg-black">
        <div className="absolute inset-0">
          <img src={data.img} alt={data.title} className="w-full h-full object-cover brightness-[0.3]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <Link href="/lift-services" className="text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 font-mono mb-2">
            ← Back to Lift Services
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            {data.tagline}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white text-center">
            {data.title}<span className="text-blue-500">.</span>
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto" />
        </div>
      </section>

      {/* ── 2. Content ────────────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-white border-b border-neutral-200">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-10">
            <p className="text-neutral-700 text-lg md:text-xl leading-relaxed font-light">{data.description}</p>
            <div className="space-y-6">
              {data.details.map((detail, idx) => (
                <div key={idx} className="flex gap-6 p-8 md:p-10 rounded-none bg-neutral-50 border border-neutral-200">
                  <span className="text-white font-mono text-xs font-bold px-3 py-1 bg-blue-600 shrink-0 self-start">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-neutral-700 text-sm md:text-base leading-relaxed font-normal">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-neutral-100 rounded-none p-10 md:p-12 text-neutral-900 sticky top-28 space-y-6 border border-neutral-200">
              <span className="text-xs font-semibold tracking-widest text-blue-700 uppercase block font-mono">Engineering Consultation</span>
              <h3 className="text-2xl font-bold uppercase tracking-tight text-neutral-900">Ready to Upgrade or Procure Parts?</h3>
              <p className="text-neutral-600 text-sm leading-relaxed font-light">Get in touch with our certified engineers in Kilimani for a free site assessment and prompt quotation.</p>
              <Link href="/contact" className="w-full h-14 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none">
                <span>Request a Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </ScrollRevealPage>
  );
}
