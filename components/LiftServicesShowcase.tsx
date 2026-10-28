"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export type LiftServiceContent = {
  slug: string;
  num: string;
  badge?: string;
  title: string;
  tagline: string;
  desc: string;
  features: string[];
  img: string;
  buttonLabel?: string;
  buttonHref?: string;
  partsTitle?: string;
  partsDescription?: string;
  partsFeatures?: string[];
  partsButtonLabel?: string;
  partsButtonHref?: string;
};

export default function LiftServicesShowcase({
  services,
  subtitle = "SUPPLY · INSTALLATION · MAINTENANCE",
  title = "Three services. One accountable partner.",
  lifecycleCopy,
  outcomes,
}: {
  services: LiftServiceContent[];
  subtitle?: string;
  title?: string;
  lifecycleCopy: string;
  outcomes: string[];
}) {
  if (services.length !== 3) return null;

  return (
    <section className="bg-[#F5F5F3] px-6 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mx-auto mb-14 max-w-3xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">
              {subtitle}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl md:text-5xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-600">
              {lifecycleCopy}
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            {services.map((service, index) => (
              <article
                id={service.slug}
                key={service.slug}
                className="group flex scroll-mt-28 flex-col overflow-hidden rounded-none border border-neutral-200 bg-white transition-all duration-300 hover:border-blue-600/40 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <Image
                    src={service.img}
                    alt={`${service.title} elevator engineering`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
                  <span className="absolute left-5 top-5 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-900 border border-neutral-200">
                    {service.badge || `SE-${service.num}`}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
                    {service.tagline}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
                    {service.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-neutral-600">{service.desc}</p>
                  <ul className="mt-6 space-y-3 border-t border-neutral-200 pt-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm leading-6 text-neutral-700">
                        <CheckCircle2
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 shrink-0 text-[#2563EB]"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {index === 2 && service.partsTitle && (
                    <aside className="mt-7 border-l-2 border-[#2563EB] bg-[#F5F5F3] p-5">
                      <h4 className="text-sm font-semibold text-neutral-950">{service.partsTitle}</h4>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        {service.partsDescription}
                      </p>
                      {service.partsFeatures && (
                        <ul className="mt-4 space-y-2">
                          {service.partsFeatures.map((feature) => (
                            <li key={feature} className="text-xs leading-5 text-neutral-600">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Link
                        href={service.partsButtonHref || "/elevators#spare-parts"}
                        className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-700 transition-colors hover:text-[#2563EB]"
                      >
                        {service.partsButtonLabel || "Browse genuine components"}
                        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                      </Link>
                    </aside>
                  )}

                  <Link
                    href={service.buttonHref || `/contact?service=${service.slug}`}
                    className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 bg-neutral-950 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#2563EB]"
                  >
                    {service.buttonLabel || `Discuss ${service.title.toLowerCase()}`}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <ul className="mt-10 grid gap-4 border-y border-neutral-300 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-3 text-sm font-medium leading-6 text-neutral-800">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#2563EB]" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>
    </section>
  );
}
