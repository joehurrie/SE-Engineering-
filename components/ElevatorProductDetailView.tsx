import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";
import ElevatorProductGallery from "@/components/ElevatorProductGallery";
import ElevatorProductCard from "@/components/ElevatorProductCard";
import ScrollRevealPage from "@/components/ScrollRevealPage";

type ElevatorProduct = {
  category: string;
  title: string;
  description: string;
  specifications: string | null;
  imageUrl: string;
  galleryImages: string[];
};

export type RelatedElevatorProduct = {
  id: string | number;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
};

export default function ElevatorProductDetailView({
  product,
  relatedProducts = [],
}: {
  product: ElevatorProduct;
  relatedProducts?: RelatedElevatorProduct[];
}) {
  const images = Array.from(
    new Set(
      [product.imageUrl, ...(Array.isArray(product.galleryImages) ? product.galleryImages : [])]
        .filter((image): image is string => typeof image === "string" && image.trim().length > 0),
    ),
  );
  const parsedSpecs = (() => {
    if (!product.specifications) return [];
    try {
      const parsed: unknown = JSON.parse(product.specifications);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return Object.entries(parsed).map(([label, value]) => [label, String(value)]);
      }
    } catch {
      return [["Specifications", product.specifications]];
    }
    return [["Specifications", product.specifications]];
  })();

  return (
    <ScrollRevealPage>
    <main className="min-h-screen bg-white text-[#111111]">
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-[#F5F5F3] px-6 py-32 text-white">
        <Image
          src={product.imageUrl}
          alt={product.category}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <Link
            href="/elevators"
            className="mb-12 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white drop-shadow-lg hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            All elevator products
          </Link>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white drop-shadow-lg">
            {product.category}
          </p>
          <h1 className="max-w-4xl text-4xl font-bold uppercase leading-tight tracking-tight drop-shadow-lg sm:text-5xl md:text-7xl">
            {product.title}
          </h1>
        </div>
      </section>

      <section className="bg-[#F5F5F3] px-6 py-14 md:py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-600">
                Product gallery
              </p>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                {images.length} {images.length === 1 ? "image" : "images"}
              </span>
            </div>
            <ElevatorProductGallery images={images} productName={product.title} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
              <span className="h-px w-8 bg-blue-600" />
              Product overview
            </p>
            <h2 className="mt-5 text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
              Designed for dependable performance.
            </h2>
            <p className="mt-6 whitespace-pre-line text-base leading-8 text-neutral-600">
              {product.description}
            </p>
            <div className="mt-8 flex items-start gap-3 border-l-2 border-blue-600 bg-white px-5 py-4">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                  Product category
                </p>
                <p className="mt-1 text-sm font-semibold">{product.category}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {parsedSpecs.length > 0 && (
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                <ClipboardList aria-hidden="true" className="h-4 w-4" />
                Technical details
              </p>
              <h2 className="mt-5 text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
                Product specifications
              </h2>
            </div>
            <dl className="divide-y divide-neutral-200 border-y border-neutral-200">
              {parsedSpecs.map(([label, value], index) => (
                <div key={`${label}-${index}`} className="grid gap-2 py-5 sm:grid-cols-[0.7fr_1.3fr] sm:gap-8">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium leading-6 text-neutral-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="bg-neutral-100 px-6 py-14 text-neutral-900 md:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Interested in this product?
            </p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight text-neutral-900 sm:text-4xl">
              Request this product.
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Contact our team to discuss availability, specifications, and installation requirements.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-3 bg-blue-700 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-blue-800"
          >
            Request this product <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-neutral-50 px-6 py-16 md:py-24">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                Keep exploring
              </p>
              <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight text-black sm:text-4xl">
                Explore similar products
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-600">
                Browse more {product.category.toLowerCase()} products from our catalogue.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ElevatorProductCard
                  key={relatedProduct.id}
                  category={relatedProduct.category}
                  title={relatedProduct.title}
                  description={relatedProduct.description}
                  imageUrl={relatedProduct.imageUrl}
                  href={relatedProduct.href}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
    </ScrollRevealPage>
  );
}
