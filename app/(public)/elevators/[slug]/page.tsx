import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { slugToCategory } from "@/lib/slugs";

export const dynamic = "force-dynamic";

type ElevatorData = {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  heroImg: string;
  galleryImgs: string[];
};

const elevatorData: Record<string, ElevatorData> = {
  "home-lift": {
    title: "Home Lift",
    tagline: "Elegant Residential Vertical Transport",
    description:
      "Our home lifts are designed for multi-story residences, offering a seamless blend of aesthetics and functionality. Silent operation, compact footprint, and customizable cab designs make them ideal for villas, townhouses, and private estates.",
    features: [
      "Noise-free operation < 45dB",
      "Compact pit-less shaft design",
      "Panoramic glass cab option",
      "Smart home integration",
      "Battery backup in case of power failure",
      "10-year structural warranty",
    ],
    specs: [
      { label: "Capacity", value: "2–8 persons (250–630 kg)" },
      { label: "Speed", value: "0.15–1.0 m/s" },
      { label: "Travel", value: "Up to 15 floors" },
      { label: "Drive", value: "Traction / Hydraulic / MRL" },
    ],
    heroImg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200",
    galleryImgs: [
      "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=600",
    ],
  },
  "passenger-elevator": {
    title: "Passenger Elevator",
    tagline: "High-Efficiency Commercial Vertical Transport",
    description:
      "Built through our exclusive XIZI supply partnership, our passenger elevators deliver exceptional performance for commercial and high-rise residential projects. Energy-efficient, fast, and reliable across all building types.",
    features: [
      "XIZI exclusive supply partnership",
      "VVVF drive for energy savings",
      "Destination dispatch systems",
      "Anti-vibration cabin design",
      "Smart diagnostics & remote monitoring",
      "BS EN 81 certified",
    ],
    specs: [
      { label: "Capacity", value: "8–33 persons (630–2500 kg)" },
      { label: "Speed", value: "1.0–6.0 m/s" },
      { label: "Travel", value: "Up to 80 floors" },
      { label: "Drive", value: "Gearless traction MRL" },
    ],
    heroImg: "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1200",
    galleryImgs: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?auto=format&fit=crop&q=80&w=600",
    ],
  },
  "escalator-moving-walk": {
    title: "Escalator & Moving Walk",
    tagline: "Heavy-Duty Public Transport Systems",
    description:
      "Our escalators and moving walks are designed for high-traffic commercial environments. Installed in landmark projects including Talanta Hela Stadium, these systems combine durability with smooth, continuous people-moving capability.",
    features: [
      "Continuous step renewal system",
      "Safety sensors & anti-reversal devices",
      "Variable speed control",
      "Stainless steel balustrades",
      "Energy regeneration drive",
      "Suitable for outdoor/indoor use",
    ],
    specs: [
      { label: "Angle", value: "30° / 35°" },
      { label: "Width", value: "600 / 800 / 1000 mm" },
      { label: "Speed", value: "0.5 m/s" },
      { label: "Capacity", value: "Up to 9,000 persons/hour" },
    ],
    heroImg: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1200",
    galleryImgs: [
      "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
    ],
  },
  "panoramic-elevator": {
    title: "Panoramic Elevator",
    tagline: "Architectural Statement Capsule Elevators",
    description:
      "Our panoramic elevators transform vertical transport into an aesthetic experience. Full glass walls reveal stunning interior or exterior views, making them ideal for hotels, malls, and landmark commercial buildings.",
    features: [
      "Tempered curved glass panels",
      "360° panoramic view",
      "LED ambient lighting systems",
      "Quiet gearless drive",
      "Custom cabin aesthetics",
      "Compliant with glass structural standards",
    ],
    specs: [
      { label: "Capacity", value: "6–20 persons" },
      { label: "Speed", value: "0.5–2.5 m/s" },
      { label: "Glass Type", value: "Tempered laminated safety glass" },
      { label: "Drive", value: "Gearless MRL traction" },
    ],
    heroImg: "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?auto=format&fit=crop&q=80&w=1200",
    galleryImgs: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=600",
    ],
  },
  "hospital-elevator": {
    title: "Hospital Elevator",
    tagline: "Medical-Grade Vertical Transport",
    description:
      "Designed to meet strict medical standards, our hospital elevators feature oversized cabs for stretcher access, smooth acceleration for patient comfort, and antimicrobial surfaces for hygiene compliance.",
    features: [
      "Stretcher-compatible oversized cab",
      "Ultra-smooth start/stop acceleration",
      "Antimicrobial interior surfaces",
      "Automatic priority mode for emergencies",
      "Backup power for continuous operation",
      "Wide opening doors (1200mm+)",
    ],
    specs: [
      { label: "Capacity", value: "1600–2500 kg" },
      { label: "Speed", value: "0.63–2.5 m/s" },
      { label: "Door Opening", value: "1200–1400 mm wide" },
      { label: "Cab Depth", value: "2400–2800 mm" },
    ],
    heroImg: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
    galleryImgs: [
      "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
    ],
  },
  "freight-car-elevator": {
    title: "Freight Elevator & Car Elevator",
    tagline: "Heavy-Duty Industrial & Parking Solutions",
    description:
      "Engineered for maximum load capacity and durability, our freight and car elevators serve industrial warehouses, logistics centers, and multi-level parking structures with precision and reliability.",
    features: [
      "Heavy-duty steel reinforced cab",
      "Load capacity up to 10,000 kg",
      "Heavy-duty door mechanisms",
      "Anti-static and dustproof options",
      "Remote monitoring & diagnostics",
      "Suitable for vehicles up to 5 tonnes",
    ],
    specs: [
      { label: "Capacity", value: "1000–10,000 kg" },
      { label: "Speed", value: "0.25–1.0 m/s" },
      { label: "Door Type", value: "Bi-parting / Roll-up" },
      { label: "Drive", value: "Geared traction / Hydraulic" },
    ],
    heroImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
    galleryImgs: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=600",
    ],
  },
  "dumbwaiter": {
    title: "Dumbwaiter",
    tagline: "Compact Service Lifts for Efficient Operations",
    description:
      "Our dumbwaiters streamline the movement of food, documents, and lightweight cargo between floors. Perfect for restaurants, hotels, hospitals, libraries, and office buildings.",
    features: [
      "Compact design for tight spaces",
      "Quiet motor operation",
      "Stainless steel interior",
      "Push-button or automatic controls",
      "Safety interlocks on all doors",
      "Easy maintenance access",
    ],
    specs: [
      { label: "Capacity", value: "50–500 kg" },
      { label: "Speed", value: "0.15–0.5 m/s" },
      { label: "Platform Size", value: "Custom to requirements" },
      { label: "Drive", value: "Traction / Hydraulic" },
    ],
    heroImg: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1200",
    galleryImgs: [
      "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
    ],
  },
  "hydraulic-platform": {
    title: "Hydraulic Platform",
    tagline: "Versatile Lifting for Accessible Buildings",
    description:
      "Our hydraulic platforms provide an affordable, reliable solution for low-rise buildings and accessibility compliance. Smooth, quiet operation with minimal shaft requirements.",
    features: [
      "Pit-less installation available",
      "Silent hydraulic pump",
      "Weatherproof outdoor models",
      "Manual lowering in emergencies",
      "Disabled access compliant",
      "Minimal maintenance requirements",
    ],
    specs: [
      { label: "Capacity", value: "250–1000 kg" },
      { label: "Speed", value: "0.05–0.15 m/s" },
      { label: "Travel", value: "Up to 6 floors" },
      { label: "Drive", value: "Hydraulic" },
    ],
    heroImg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
    galleryImgs: [
      "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = elevatorData[slug];
  if (!data) return { title: "Not Found" };
  return {
    title: data.title,
    description: data.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(elevatorData).map((slug) => ({ slug }));
}

export default async function ElevatorDetailPage({ params }: Props) {
  const { slug } = await params;
  const staticData = elevatorData[slug];

  let dbItem = null;
  try {
    const categoryName = slugToCategory(slug);
    dbItem = await prisma.elevatorProduct.findFirst({
      where: {
        OR: [
          { category: { equals: categoryName, mode: "insensitive" } },
          { title: { contains: categoryName, mode: "insensitive" } },
        ],
      },
    });
  } catch (error) {
    console.error("Failed to query elevator product:", error);
  }

  if (!staticData && !dbItem) notFound();

  const data = {
    title: dbItem?.title || staticData?.title || slugToCategory(slug),
    tagline: staticData?.tagline || dbItem?.category || "Precision Vertical Transport",
    description: dbItem?.description || staticData?.description || "Engineered vertical transportation.",
    features: staticData?.features || [
      "BS EN 81 safety compliance",
      "VVVF energy-saving drive",
      "Smart micro-leveling precision",
      "Anti-vibration acoustic dampening",
    ],
    specs: staticData?.specs || [
      { label: "Category", value: dbItem?.category || "Elevator System" },
      { label: "Specifications", value: dbItem?.specifications || "Standard Commercial" },
    ],
    heroImg: dbItem?.imageUrl || staticData?.heroImg || "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=1200",
    galleryImgs: [
      dbItem?.imageUrl || staticData?.galleryImgs?.[0] || "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=600",
      ...(staticData?.galleryImgs?.slice(1) || []),
    ],
  };

  return (
    <div className="bg-white text-[#111111] min-h-screen">
      {/* ── 1. Hero: 50vh View Height ───────────────────────── */}
      {/* ── 1. Hero: 50vh View Height (Centered) ───────────── */}
      <section className="min-h-[50vh] min-h-[50svh] min-h-[380px] relative pt-32 pb-16 flex items-center justify-center overflow-hidden border-b border-black bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src={data.heroImg}
            alt={data.title}
            className="w-full h-full object-cover brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <Link
            href="/elevators"
            className="text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 font-mono mb-2"
          >
            ← Back to All Elevators
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

      {/* ── 2. Content & Specs ────────────────────────────────── */}
      <section className="py-24 md:py-36 bg-white border-b border-neutral-200">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Description + Features */}
          <div className="lg:col-span-7 space-y-12">
            <p className="text-neutral-700 text-lg md:text-xl leading-relaxed font-light">
              {data.description}
            </p>

            <div>
              <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase block font-mono mb-6">
                Key Engineering Features
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-6 rounded-none bg-neutral-50 border border-neutral-200">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-neutral-800 text-sm leading-relaxed font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase block font-mono mb-6">
                Installation Gallery
              </span>
              <div className="grid grid-cols-2 gap-6">
                {data.galleryImgs.map((img, idx) => (
                  <div key={idx} className="h-64 rounded-none overflow-hidden border border-neutral-200 shadow-sm">
                    <img src={img} alt={`${data.title} gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Specs + CTA */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-neutral-50 border border-neutral-200 rounded-none p-10 md:p-12">
              <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase block font-mono mb-6">
                Technical Specifications
              </span>
              <div className="space-y-0 divide-y divide-neutral-200">
                {data.specs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-center py-4">
                    <span className="text-neutral-500 text-xs uppercase tracking-wider">{spec.label}</span>
                    <span className="text-black text-sm font-mono font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black rounded-none p-10 md:p-12 text-white relative overflow-hidden border border-neutral-800">
              <div className="space-y-4 mb-8">
                <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase block font-mono">
                  Architectural Tenders
                </span>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                  Request Specifications
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed font-light">
                  Consult with our specialized lift engineers for architectural shaft layout drawings and pricing for {data.title}.
                </p>
              </div>
              <Link
                href="/contact"
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none"
              >
                <span>Request a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
