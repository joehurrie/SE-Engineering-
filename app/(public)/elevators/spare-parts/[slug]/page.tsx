import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ElevatorProductDetailView, {
  type RelatedElevatorProduct,
} from "@/components/ElevatorProductDetailView";
import { defaultSpareParts } from "@/lib/default-spare-parts";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type SparePartPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return defaultSpareParts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: SparePartPageProps): Promise<Metadata> {
  const { slug } = await params;
  let title: string | undefined;
  let description: string | undefined;
  try {
    const part = await prisma.sparePartProduct.findUnique({ where: { slug } });
    title = part?.title;
    description = part?.description;
  } catch (error) {
    console.error("Failed to load spare part metadata:", error);
  }

  const part = defaultSpareParts.find((item) => item.slug === slug);
  title ??= part?.title;
  description ??= part?.description;
  return part
    ? {
        title: `${title} | Specialized Engineering Kenya Ltd.`,
        description,
      }
    : title
      ? { title: `${title} | Specialized Engineering Kenya Ltd.`, description }
      : { title: "Spare Part | Specialized Engineering Kenya Ltd." };
}

export default async function SparePartDetailPage({ params }: SparePartPageProps) {
  const { slug } = await params;
  let databasePart: Awaited<ReturnType<typeof prisma.sparePartProduct.findUnique>> = null;
  try {
    databasePart = await prisma.sparePartProduct.findUnique({ where: { slug } });
  } catch (error) {
    console.error("Failed to load spare part:", error);
  }

  const part = databasePart ?? defaultSpareParts.find((item) => item.slug === slug);
  if (!part) notFound();

  const databaseRelatedParts = databasePart
    ? await prisma.sparePartProduct.findMany({
        where: { id: { not: databasePart.id } },
        orderBy: { id: "asc" },
        take: 3,
      }).catch((error) => {
        console.error("Failed to load related spare parts:", error);
        return [];
      })
    : [];
  const relatedProducts: RelatedElevatorProduct[] = databaseRelatedParts.length
    ? databaseRelatedParts.map((item) => ({
        id: item.id,
        category: "Spare Parts",
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        href: `/elevators/spare-parts/${item.slug}`,
      }))
    : defaultSpareParts
        .filter((item) => item.slug !== part.slug)
        .slice(0, 3)
        .map((item) => ({
          id: item.slug,
          category: "Spare Parts",
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          href: `/elevators/spare-parts/${item.slug}`,
        }));

  return (
    <ElevatorProductDetailView
      product={{
        category: "Spare Parts",
        title: part.title,
        description: part.description,
        specifications: part.specifications,
        imageUrl: part.imageUrl,
        galleryImages: part.galleryImages,
      }}
      relatedProducts={relatedProducts}
    />
  );
}
