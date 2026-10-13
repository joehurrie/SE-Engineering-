import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ElevatorProductDetailView from "@/components/ElevatorProductDetailView";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

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
      return {
        title: `${sparePart.title} | Specialized Engineering Kenya Ltd.`,
        description: sparePart.description,
      };
    }
  }
  return {
    title: product
      ? `${product.title} | Specialized Engineering Kenya Ltd.`
      : "Elevator Product | Specialized Engineering Kenya Ltd.",
    description: product?.description,
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

  return <ElevatorProductDetailView product={product} relatedProducts={relatedProducts} />;
}
