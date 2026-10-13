import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-neutral-200 bg-white transition-all duration-300 hover:border-blue-600/40 hover:shadow-xl">
      <Link href={href} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <Image
            src={imageUrl}
            alt={category}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
          <span className="absolute bottom-4 left-4 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-900">
            {category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-7">
          <h3 className="text-xl font-bold uppercase tracking-tight text-black group-hover:text-blue-600">
            {title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-500">
            {description}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-6">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-900">
              Explore product
            </span>
            <ArrowRight aria-hidden="true" className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
}
