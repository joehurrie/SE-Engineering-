import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { categoryToSlug } from "@/lib/slugs";
import ElevatorProductCard from "@/components/ElevatorProductCard";
import ScrollRevealPage from "@/components/ScrollRevealPage";
import { defaultSpareParts } from "@/lib/default-spare-parts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Elevator Solutions",
  description:
    "Explore our full range of elevator solutions: home lifts, passenger elevators, escalators, hospital elevators, and more.",
};

type ElevatorCatalogItem = {
  slug: string;
  title: string;
  category: string;
  desc: string;
  img: string;
  num: string;
  spec: string;
  href?: string;
};

const defaultElevatorCategories: ElevatorCatalogItem[] = [
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

type ElevatorsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ElevatorsPage({ searchParams }: ElevatorsPageProps) {
  const { category: activeCategory = "all" } = await searchParams;
  let dbProducts: Awaited<ReturnType<typeof prisma.elevatorProduct.findMany>> = [];
  let dbSpareParts: Awaited<ReturnType<typeof prisma.sparePartProduct.findMany>> = [];

  try {
    dbProducts = await prisma.elevatorProduct.findMany({ orderBy: { id: "asc" } });
  } catch (error) {
    console.error("Failed to load elevators from DB:", error);
  }

  try {
    dbSpareParts = await prisma.sparePartProduct.findMany({ orderBy: { id: "asc" } });
  } catch (error) {
    console.error("Failed to load spare parts from DB:", error);
  }

  const sparePartProducts = dbSpareParts.length > 0
    ? dbSpareParts.map((part) => ({
        id: part.slug,
        title: part.title,
        description: part.description,
        imageUrl: part.imageUrl,
        href: `/elevators/spare-parts/${part.slug}`,
      }))
    : defaultSpareParts.map((part) => ({
        id: part.slug,
        title: part.title,
        description: part.description,
        imageUrl: part.imageUrl,
        href: `/elevators/spare-parts/${part.slug}`,
      }));
  const databaseElevators = dbProducts.filter((product) => product.category.trim().toLowerCase() !== "spare parts");
  const elevatorProducts: ElevatorCatalogItem[] = databaseElevators.length
    ? databaseElevators
        .map((product, index) => ({
          slug: String(product.id),
          title: product.title,
          category: product.category,
          desc: product.description,
          img: product.imageUrl,
          num: String(index + 1).padStart(2, "0"),
          spec: product.specifications || "",
          href: `/elevators/product/${product.id}`,
        }))
    : defaultElevatorCategories;

  const filteredProducts = elevatorProducts.filter((product) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "lifts") {
      return !product.category.toLowerCase().includes("escalator")
        && !product.category.toLowerCase().includes("moving walk")
        && !product.category.toLowerCase().includes("transit")
        && product.slug !== "escalator-moving-walk";
    }
    return categoryToSlug(product.category) === activeCategory
      || product.slug === activeCategory;
  });
  const categoryOptions = Array.from(
    new Map(
      elevatorProducts.map((product) => [
        product.href ? categoryToSlug(product.category) : product.slug,
        product.href ? product.category : product.title,
      ]),
    ).entries(),
  );
  const heroImg = elevatorProducts[0]?.img || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1600";

  return (
    <ScrollRevealPage className="bg-white text-[#111111] min-h-screen">
      {/* ── 1. Hero: 50vh View Height (Centered) ───────────── */}
      <section className="min-h-screen pt-32 pb-16 relative overflow-hidden border-b border-neutral-900 flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImg}
            alt="Vertical Transportation Shaft"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25]"
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

      <section id="elevator-products" className="bg-neutral-50 px-6 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="inline-block border border-neutral-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-600">
                Product catalogue
              </p>
              <h2 className="mt-5 text-4xl font-bold uppercase tracking-tight text-black md:text-5xl">
                Find the right system.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-600">
                Browse our lift and elevator systems by category, then explore product images and technical specifications.
              </p>
            </div>
          </div>

          <nav aria-label="Filter elevator products" className="mb-10 flex flex-wrap justify-center gap-2">
            {[
              { label: "All products", value: "all" },
              { label: "Lifts", value: "lifts" },
              ...categoryOptions.map(([value, label]) => ({ label, value })),
            ].map((option) => (
              <Link
                key={option.value}
                href={option.value === "all" ? "/elevators" : `/elevators?category=${encodeURIComponent(option.value)}`}
                className={`shrink-0 border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                  activeCategory === option.value
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-black hover:text-black"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </nav>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ElevatorProductCard
                  key={product.href || product.slug}
                  category={product.category}
                  title={product.title}
                  description={product.desc}
                  imageUrl={product.img}
                  href={product.href || `/elevators/${product.slug}`}
                />
              ))}
            </div>
          ) : (
            <div className="border border-neutral-200 bg-white px-6 py-16 text-center">
              <p className="text-sm text-neutral-600">No products are currently listed in this category.</p>
              <Link href="/contact" className="mt-4 inline-flex text-xs font-semibold uppercase tracking-wider text-blue-600">
                Ask us about this system <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="spare-parts" className="scroll-mt-24 border-t border-neutral-200 bg-white px-6 py-20 md:py-28">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="inline-block border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-600">
                Parts & components
              </p>
              <h2 className="mt-5 text-4xl font-bold uppercase tracking-tight text-black md:text-5xl">
                Spare parts.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-600">
                Request genuine lift components and replacement parts from our technical team.
              </p>
            </div>
            {sparePartProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sparePartProducts.map((part) => (
                  <ElevatorProductCard
                    key={part.id}
                    category="Spare Parts"
                    title={part.title}
                    description={part.description}
                    imageUrl={part.imageUrl}
                    href={part.href}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-5 border border-neutral-200 bg-neutral-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <p className="max-w-2xl text-sm leading-6 text-neutral-700">
                  Tell us what component you need and our team will help identify the right spare part for your system.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center gap-2 bg-blue-700 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-blue-800"
                >
                  Request a spare part <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── 3. Bottom CTA Section ───────────────────────────── */}
      <section className="flex w-full items-center justify-center bg-neutral-100 py-28 text-neutral-900 md:py-36">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="inline-flex items-center gap-2 border border-neutral-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700">
            ENGINEERING SPECIFICATION
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-900">
            Need Custom Dimensions or Low Pit Shafts?
          </h2>
          <p className="text-neutral-600 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Our engineering team prepares detailed shaft CAD drawings, load calculations, and municipal approval documents.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="px-10 py-4 bg-blue-700 text-white hover:bg-blue-800 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Consult an Engineer
            </Link>
            <Link
              href="/projects"
              className="px-10 py-4 border border-neutral-300 hover:border-neutral-500 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              View Installed Projects
            </Link>
          </div>
        </div>
      </section>
    </ScrollRevealPage>
  );
}
