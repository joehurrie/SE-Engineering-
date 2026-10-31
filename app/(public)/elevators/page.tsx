import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { categoryToSlug } from "@/lib/slugs";
import ElevatorProductCard from "@/components/ElevatorProductCard";
import ScrollRevealPage from "@/components/ScrollRevealPage";
import { defaultSpareParts } from "@/lib/default-spare-parts";
import { getContentValue, loadSiteContentMap } from "@/lib/home-content";

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


type ElevatorsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ElevatorsPage({ searchParams }: ElevatorsPageProps) {
  const { category: activeCategory = "all" } = await searchParams;
  let content: Awaited<ReturnType<typeof loadSiteContentMap>> = {};
  try {
    content = await loadSiteContentMap([
      "elevators_hero",
      "elevators_catalog",
      "elevators_spare_parts",
      "elevators_cta",
    ]);
  } catch (error) {
    console.error("Failed to load Elevators page content:", error);
  }
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
  const elevatorProducts: ElevatorCatalogItem[] = databaseElevators
    .map((product, index) => ({
      slug: String(product.id),
      title: product.title,
      category: product.category,
      desc: product.description,
      img: product.imageUrl,
      num: String(index + 1).padStart(2, "0"),
      spec: product.specifications || "",
      href: `/elevators/product/${product.id}`,
    }));

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
  const heroImg = getContentValue(content.elevators_hero, "imageUrl", elevatorProducts[0]?.img || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1600");
  const heroVideo = content.elevators_hero?.videoUrl?.trim();

  return (
    <ScrollRevealPage className="bg-white text-[#111111] min-h-screen">
      {/* ── 1. Hero: Standardized Dimensions (100% view height on mobile, 70vh on desktop) ── */}
      <section className="relative flex min-h-[100svh] md:min-h-0 md:h-[70vh] items-center justify-center overflow-hidden border-b border-neutral-200 bg-[#F5F5F3] px-6 py-12 md:py-16 text-center">
        <div className="absolute inset-0 z-0">
          {heroVideo ? (
            <video src={heroVideo} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <Image src={heroImg} alt="Vertical Transportation Shaft" fill priority sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            {getContentValue(content.elevators_hero, "subtitle", "CATALOG RANGE")}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white drop-shadow-lg mb-2 text-center">
            {getContentValue(content.elevators_hero, "title", "Elevator Solutions.")}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-4" />
          <p className="text-white drop-shadow-lg text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
            {getContentValue(content.elevators_hero, "bodyText", "Engineered to international ISO specifications. From bespoke residential villa lifts to heavy commercial high-rise towers, explore all official elevator categories installed and maintained by Specialized Engineering.")}
          </p>
        </div>
      </section>

      <section id="elevator-products" className="bg-neutral-50 px-6 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-12">
            <div className="mx-auto max-w-2xl text-center">
              <p className="inline-block border border-neutral-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-600">
                {getContentValue(content.elevators_catalog, "badge", "Product catalogue")}
              </p>
              <h2 className="mt-5 text-4xl font-bold uppercase tracking-tight text-black md:text-5xl">
                {getContentValue(content.elevators_catalog, "title", "Find the right system.")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral-600">
                {getContentValue(content.elevators_catalog, "bodyText", "Browse our lift and elevator systems by category, then explore product images and technical specifications.")}
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

        {/* ── 3. Bottom CTA Section ───────────────────────────── */}
      <section className="flex w-full items-center justify-center bg-neutral-100 py-28 text-neutral-900 md:py-36">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="inline-flex items-center gap-2 border border-neutral-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-700">
            {getContentValue(content.elevators_cta, "badge", "ENGINEERING SPECIFICATION")}
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-900">
            {getContentValue(content.elevators_cta, "title", "Need Custom Dimensions or Low Pit Shafts?")}
          </h2>
          <p className="text-neutral-600 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            {getContentValue(content.elevators_cta, "bodyText", "Our engineering team prepares detailed shaft CAD drawings, load calculations, and municipal approval documents.")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={getContentValue(content.elevators_cta, "buttonHref", "/contact")}
              className="px-10 py-4 bg-blue-700 text-white hover:bg-blue-800 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              {getContentValue(content.elevators_cta, "buttonLabel", "Consult an Engineer")}
            </Link>
            <Link
              href={getContentValue(content.elevators_cta, "secondaryButtonHref", "/projects")}
              className="px-10 py-4 border border-neutral-300 hover:border-neutral-500 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              {getContentValue(content.elevators_cta, "secondaryButtonLabel", "View Installed Projects")}
            </Link>
          </div>
        </div>
      </section>
    </ScrollRevealPage>
  );
}
