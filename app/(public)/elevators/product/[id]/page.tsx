import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ElevatorProductDetailView from "@/components/ElevatorProductDetailView";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.specializedengineeringltd.co.ke";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId < 1) {
    return { title: "Elevator Product | Specialized Engineering Kenya Ltd." };
  }

  const product = await prisma.elevatorProduct.findUnique({ where: { id: productId } });
  if (!product) {
    const sparePart = await prisma.sparePartProduct.findUnique({ where: { id: productId } });
    if (sparePart) {
      const spareTitle = `${sparePart.title} | Specialized Engineering Kenya Ltd.`;
      const spareDesc = sparePart.description ?? "Elevator spare part — Specialized Engineering Kenya Ltd.";
      const spareImg = sparePart.imageUrl
        ? sparePart.imageUrl.startsWith("http") ? sparePart.imageUrl : `${SITE_URL}${sparePart.imageUrl}`
        : `${SITE_URL}/og-image.jpeg`;
      return {
        title: spareTitle,
        description: spareDesc,
        alternates: { canonical: `${SITE_URL}/elevators/spare-parts/${sparePart.slug}` },
        openGraph: { url: `${SITE_URL}/elevators/spare-parts/${sparePart.slug}`, title: spareTitle, description: spareDesc, images: [{ url: spareImg, width: 1200, height: 630, alt: sparePart.title }] },
        twitter: { card: "summary_large_image", title: spareTitle, description: spareDesc, images: [spareImg] },
      };
    }
  }

  const title = product
    ? `${product.title} | Specialized Engineering Kenya Ltd.`
    : "Elevator Product | Specialized Engineering Kenya Ltd.";
  const description =
    product?.description ?? "Elevator product — Specialized Engineering Kenya Ltd.";
  const imageUrl = product?.imageUrl
    ? product.imageUrl.startsWith("http") ? product.imageUrl : `${SITE_URL}${product.imageUrl}`
    : `${SITE_URL}/og-image.jpeg`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/elevators/product/${productId}` },
    openGraph: {
      url: `${SITE_URL}/elevators/product/${productId}`,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product?.title ?? "Elevator Product" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ElevatorProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId < 1) notFound();

  const product = await prisma.elevatorProduct.findUnique({ where: { id: productId } });
  if (!product) {
    const sparePart = await prisma.sparePartProduct.findUnique({ where: { id: productId } });
    if (sparePart) redirect(`/elevators/spare-parts/${sparePart.slug}`);
    notFound();
  }

  const categoryProducts = await prisma.elevatorProduct.findMany({
    where: { category: { equals: product.category, mode: "insensitive" } },
    orderBy: { id: "asc" },
  });
  const sameCategoryProducts = categoryProducts.length > 1
    ? categoryProducts
    : await prisma.elevatorProduct.findMany({
        where: {
          id: { not: product.id },
        },
        orderBy: { id: "asc" },
      });
  const relatedProducts = sameCategoryProducts
    .filter((item) => item.id !== product.id && item.category.toLowerCase() !== "spare parts")
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      category: item.category,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      href: `/elevators/product/${item.id}`,
    }));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.imageUrl
      ? product.imageUrl.startsWith("http")
        ? product.imageUrl
        : `${SITE_URL}${product.imageUrl}`
      : `${SITE_URL}/og-image.jpeg`,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "Specialized Engineering Kenya Ltd.",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KES",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Specialized Engineering Kenya Ltd.",
        url: SITE_URL,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ElevatorProductDetailView product={product} relatedProducts={relatedProducts} />
    </>
  );
}
