import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { categoryToSlug } from "@/lib/slugs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Elevator Solutions",
  description:
    "Explore our full range of elevator solutions: home lifts, passenger elevators, escalators, hospital elevators, and more.",
};

const defaultElevatorCategories = [
  {
    slug: "home-lift",
    title: "Home Lift",
    category: "Luxury Residential",
    desc: "Tailored residential solutions for multi-story villas and private homes. Whisper-quiet, compact, and energy-efficient.",
    img: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=800",
    num: "01",
    spec: "Payload 250–400 kg · Single/3-Phase",
  },
  {
    slug: "passenger-elevator",
    title: "Passenger Elevator",
    category: "Commercial High-Rise",
    desc: "High-efficiency vertical transit for corporate towers and residential apartments with XIZI exclusive supply.",
    img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=800",
    num: "02",
    spec: "Speed up to 4.0 m/s · Group Dispatch",
  },
  {
    slug: "escalator-moving-walk",
    title: "Escalator & Moving Walk",
    category: "Public & Transit",
    desc: "Heavy-duty transit systems for shopping centers, airports, and public pedestrian transport nodes.",
    img: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=80&w=800",
    num: "03",
    spec: "Inclination 30°/35° · Heavy Transit Duty",
  },
  {
    slug: "panoramic-elevator",
    title: "Panoramic Elevator",
    category: "Observation Glass",
    desc: "All-glass architectural observation elevators providing unobstructed atrium views and prestigious aesthetics.",
    img: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=800",
    num: "04",
    spec: "Laminated Safety Glass · Custom Shapes",
  },
  {
    slug: "hospital-elevator",
    title: "Hospital Elevator",
    category: "Medical Facilities",
    desc: "Medical-grade cabins proportioned for smooth stretcher transit, delicate medical gear, and priority dispatch.",
    img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800",
    num: "05",
    spec: "Stretcher Optimized · Micro-Leveling",
  },
  {
    slug: "freight-car-elevator",
    title: "Freight Elevator & Car Elevator",
    category: "Heavy Industrial",
    desc: "Heavy-load capacity platforms with diamond-plate flooring for automobile storage towers and logistics centers.",
    img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
    num: "06",
    spec: "Payload up to 5,000 kg · Reinforced Sill",
  },
  {
    slug: "dumbwaiter",
    title: "Dumbwaiter",
    category: "Hospitality & Food",
    desc: "Stainless steel food-grade service lifts for restaurants, hotels, banks, and healthcare facilities.",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    num: "07",
    spec: "50–300 kg · SS304 Hygiene Standard",
  },
  {
    slug: "hydraulic-platform",
    title: "Hydraulic Platform",
    category: "Accessibility & Loading",
    desc: "Versatile hydraulic lifting mechanisms for low-rise accessibility, loading docks, and mezzanine floors.",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
    num: "08",
    spec: "Low Pit Requirement · Smooth Hydraulic Drive",
  },
];

export default async function ElevatorsPage() {
  let categories = defaultElevatorCategories;

  try {
    const dbProducts = await prisma.elevatorProduct.findMany({
      orderBy: { id: "asc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      // Map existing categories with database updates (image, title, description, specs)
      categories = defaultElevatorCategories.map((cat) => {
        const match = dbProducts.find(
          (p) =>
            p.category.toLowerCase() === cat.title.toLowerCase() ||
            p.title.toLowerCase().includes(cat.title.toLowerCase())
        );

        if (match) {
          return {
            ...cat,
            title: match.title,
            desc: match.description,
            img: match.imageUrl,
            spec: match.specifications || cat.spec,
          };
        }
        return cat;
      });

      // Also include any custom products added to the DB that don't match standard defaults
      const extraProducts = dbProducts.filter(
        (p) =>
          !defaultElevatorCategories.some(
            (c) =>
              c.title.toLowerCase() === p.category.toLowerCase() ||
              p.title.toLowerCase().includes(c.title.toLowerCase())
          )
      );

      if (extraProducts.length > 0) {
        extraProducts.forEach((p) => {
          categories.push({
            slug: categoryToSlug(p.category),
            title: p.title,
            category: p.category,
            desc: p.description,
            img: p.imageUrl,
            num: String(categories.length + 1).padStart(2, "0"),
            spec: p.specifications || "Engineered Custom Specification",
          });
        });
      }
    }
  } catch (error) {
    console.error("Failed to load elevators from DB:", error);
  }

  const heroImg = categories[0]?.img || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1600";

  return (
    <div className="bg-white text-[#111111] min-h-screen">
      {/* ── 1. Hero: 50vh View Height (Centered) ───────────── */}
      <section className="min-h-screen pt-32 pb-16 relative overflow-hidden border-b border-neutral-900 flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Vertical Transportation Shaft"
            className="w-full h-full object-cover brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            CATALOG RANGE
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white mb-2 text-center">
            Elevator Solutions.
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-4" />
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
            Engineered to international ISO specifications. From bespoke residential villa lifts to heavy commercial high-rise towers, 
            explore all official elevator categories installed and maintained by Specialized Engineering.
          </p>
        </div>
      </section>

      {/* ── 2. Grid of Categories (Nexia System Cards) ────────── */}
      <section className="w-full min-h-[50vh] md:min-h-[60vh] py-24 md:py-32 bg-neutral-50 border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-20 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="inline-block px-3.5 py-1.5 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-5 border border-neutral-200">
              System Range
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black mb-5 text-center">
              Engineered for Every Shaft.
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8" />
            <p className="text-base md:text-lg text-neutral-600 max-w-xl mx-auto font-light leading-relaxed text-center">
              Click any solution to explore detailed technical dimensions, cabin finishes, and traction configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/elevators/${cat.slug}`}
                className="group relative bg-white border border-neutral-200 hover:border-blue-600/40 rounded-none overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:shadow-xl"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-neutral-100">
                    <img
                      src={cat.img || "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=800"}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                    <div className="absolute top-4 left-4 z-10">
                      <span className="font-mono text-xs font-bold text-white bg-black/80 px-2.5 py-1 backdrop-blur-sm">
                        {cat.num}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-neutral-200 uppercase tracking-wider font-semibold drop-shadow">
                        {cat.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold uppercase tracking-tight text-black group-hover:text-blue-600 transition-colors">
                        {cat.title}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    <p className="text-sm text-neutral-500 font-light leading-relaxed line-clamp-3">
                      {cat.desc}
                    </p>

                    <div className="pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                        <span className="w-1.5 h-1.5 bg-blue-600 shrink-0" />
                        <span className="truncate">{cat.spec}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-1 md:px-7 md:pb-7">
                  <div className="w-full py-3 border border-neutral-200 group-hover:border-black group-hover:bg-black group-hover:text-white text-neutral-900 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                    <span>Explore Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Bottom CTA Section ───────────────────────────── */}
      <section className="w-full py-28 md:py-36 bg-black text-white flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            ENGINEERING SPECIFICATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight">
            Need Custom Dimensions or Low Pit Shafts?
          </h2>
          <p className="text-neutral-400 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Our engineering team prepares detailed shaft CAD drawings, load calculations, and municipal approval documents.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Consult an Engineer
            </Link>
            <Link
              href="/projects"
              className="px-10 py-4 border border-neutral-700 hover:border-white text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              View Installed Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
