"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export type LiftServiceContent = {
  slug: string;
  num: string;
  title: string;
  tagline: string;
  desc: string;
  features: string[];
  img: string;
};

export type LiftServicePart = {
  id: string | number;
  title: string;
  description: string;
  image: string;
  href: string;
};

export default function LiftServicesShowcase({
  services,
  spareParts,
}: {
  services: LiftServiceContent[];
  spareParts: LiftServicePart[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const [partsService, modernizationService, customService] = services;

  if (!partsService || !modernizationService || !customService) return null;

  return (
    <>
      <section id="spare-parts" className="scroll-mt-24 bg-neutral-100 px-6 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
              SE-{partsService.num} · Parts, repairs &amp; support
            </p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
              Genuine parts. Reliable repairs.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            <div className="flex flex-col border border-neutral-200 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-semibold uppercase tracking-tight text-neutral-900">
                Keep your lift moving
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-600">
                We supply spare parts and repair lifts across Kenya. Tell us what is wrong and our team will help get it moving again.
              </p>
              <ul className="mt-6 space-y-4 border-t border-neutral-200 pt-6">
                {[
                  ["Genuine parts", "Reliable components for your lift."],
                  ["Most lift brands", "Help finding the right part for your system."],
                  ["Across Kenya", "Repair and parts support nationwide."],
                ].map(([title, description]) => (
                  <li key={title} className="flex gap-3">
                    <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                    <p className="text-sm leading-6 text-neutral-600">
                      <strong className="font-semibold text-neutral-900">{title}</strong>
                      <span className="block">{description}</span>
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href={`/lift-services/${partsService.slug}`}
                className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 bg-neutral-900 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-blue-700"
              >
                Arrange a repair <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative min-h-[340px] overflow-hidden bg-neutral-200 md:min-h-[540px]">
              <Image
                src={partsService.img}
                alt="Lift components and engineering service"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                Parts, maintenance &amp; repairs
              </p>
            </div>

            <div
              className="relative h-[340px] overflow-hidden border border-neutral-200 bg-white p-5 md:h-[540px] md:p-6"
              aria-label="Browse lift spare parts"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white to-transparent" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-white to-transparent" />
              <motion.div
                animate={shouldReduceMotion ? { y: 0 } : { y: ["-50%", "0%"] }}
                transition={shouldReduceMotion ? undefined : { duration: 24, ease: "linear", repeat: Infinity }}
                className="flex flex-col"
              >
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex flex-col gap-3" aria-hidden={copy === 1}>
                    {spareParts.map((part) => (
                      <Link
                        key={`${copy}-${part.id}`}
                        href={part.href}
                        tabIndex={copy === 1 ? -1 : undefined}
                        className="group flex min-h-[82px] items-center gap-3 border border-neutral-200 bg-neutral-50 p-3 transition-colors hover:border-blue-300 hover:bg-white"
                      >
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden bg-neutral-200">
                          <Image src={part.image} alt="" fill sizes="56px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold leading-5 text-neutral-900">{part.title}</span>
                          <span className="mt-1 block line-clamp-2 text-[11px] leading-4 text-neutral-500">{part.description}</span>
                        </span>
                        <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-blue-700 transition-transform group-hover:translate-x-1" />
                      </Link>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          <div className="mt-5 text-right">
            <Link href="/elevators#spare-parts" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600 transition-colors hover:text-blue-700">
              Browse all spare parts <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="lift-modernization" className="scroll-mt-24 bg-white px-6 py-20 md:py-28">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
              SE-{modernizationService.num} · Lift modernization
            </p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
              A better ride, built on what you have.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
              Make an older lift safer, smoother and more comfortable. We upgrade what needs attention while keeping what still works.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                label: "Before",
                image: modernizationService.img,
                alt: "Existing lift system ready for modernization",
              },
              {
                label: "After",
                image: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=85&w=1400",
                alt: "Modernized elevator interior",
              },
            ].map((frame) => (
              <figure key={frame.label}>
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200">
                  <Image src={frame.image} alt={frame.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  <figcaption className="absolute bottom-4 left-4 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-800">
                    {frame.label}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
          <div className="mt-7 grid gap-3 border-t border-neutral-200 pt-6 sm:grid-cols-3">
            {[
              "A smoother and quieter ride",
              "Improved safety and reliability",
              "Less disruption than full replacement",
            ].map((feature) => (
              <p key={feature} className="flex items-start gap-3 text-sm leading-6 text-neutral-600">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                {feature}
              </p>
            ))}
          </div>
          <div className="mt-7 text-center">
            <Link
              href={`/lift-services/${modernizationService.slug}`}
              className="inline-flex min-h-11 items-center gap-2 bg-neutral-900 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-blue-700"
            >
              Explore modernization <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="custom-design" className="scroll-mt-24 bg-neutral-100 px-6 py-20 md:py-28">
        <div className="mx-auto grid w-full max-w-7xl overflow-hidden border border-neutral-200 bg-white md:grid-cols-2">
          <div className="flex flex-col justify-center p-6 sm:p-10 md:p-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
              SE-{customService.num} · Custom design
            </p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight text-neutral-900 sm:text-4xl">
              Designed around your building.
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Need a lift that fits your building, space and style? We work with you to design a solution that feels right at every level.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Designed to suit your building",
                "Choose finishes and cabin details",
                "Options for unusual spaces",
                "Guidance from plan to installation",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-neutral-700">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={`/lift-services/${customService.slug}`}
              className="mt-7 inline-flex min-h-11 w-fit items-center gap-2 bg-neutral-900 px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-blue-700"
            >
              Discuss a custom design <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative min-h-[300px] bg-neutral-200 md:min-h-[580px]">
            <Image
              src={customService.img}
              alt="Architectural elevator design"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
