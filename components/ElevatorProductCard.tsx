import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getElevatorProductAsset } from "@/lib/elevator-product-assets";

export default function ElevatorProductCard({
  category,
  description,
  href,
  imageUrl,
  title,
}: {
  category: string;
  description: string;
  href: string;
  imageUrl: string;
  title: string;
}) {
  const isSparePart = category.trim().toLowerCase() === "spare parts";
  const productAsset = isSparePart ? null : getElevatorProductAsset(title, category);

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-neutral-200 bg-white transition-all duration-300 hover:border-blue-600/40 hover:shadow-xl">
      <Link href={href} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <Image
            src={productAsset || imageUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className={`${productAsset ? "object-contain p-2" : "object-cover"} transition-transform duration-700 group-hover:scale-105`}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
        </div>
        <div className="flex flex-1 items-center gap-4 p-5 md:p-6">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-bold uppercase tracking-tight text-black group-hover:text-blue-600">
              {title}
            </h3>
            <p className="mt-2 truncate text-sm leading-6 text-neutral-500">
              {description}
            </p>
          </div>
          <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-600 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </article>
  );
}
