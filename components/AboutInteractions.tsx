"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

type Milestone = {
  year: string;
  event: string;
};

const credentials = [
  {
    title: "Quality Management",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=85&w=900",
  },
  {
    title: "Safety Compliance",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=85&w=900",
  },
  {
    title: "Technical Certification",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=85&w=900",
  },
  {
    title: "Industry Credentials",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=85&w=900",
  },
];

export function AboutTimeline({ milestones }: { milestones: Milestone[] }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 70%", "end 35%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={timelineRef} className="relative pt-6">
      <div className="absolute bottom-0 left-4 top-0 w-px bg-neutral-200 md:left-1/2 md:-translate-x-px" />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-4 top-0 w-[3px] origin-top bg-[#2563EB] shadow-[0_0_12px_rgba(37,99,235,0.8)] md:left-1/2 md:-translate-x-1/2"
        style={{ scaleY: shouldReduceMotion ? 1 : smoothProgress }}
      />

      {milestones.map((milestone, index) => (
        <article
          key={milestone.year}
          className={`relative mb-12 flex gap-8 last:mb-0 ${
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          }`}
        >
          <div
            className={`flex-1 space-y-1.5 pl-12 ${
              index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
            }`}
          >
            <span className="font-mono text-xl font-bold text-blue-600">{milestone.year}</span>
            <p className="text-base font-light leading-relaxed text-neutral-600">{milestone.event}</p>
          </div>
          <div
            aria-hidden="true"
            className="absolute left-[10px] top-2 h-3 w-3 shrink-0 rounded-full bg-[#2563EB] shadow-[0_0_12px_rgba(37,99,235,0.5)] md:left-1/2 md:-translate-x-1/2"
          />
          <div className="hidden flex-1 md:block" />
        </article>
      ))}
    </div>
  );
}

export function CredentialsGallery({ items = credentials }: { items?: typeof credentials }) {
  const galleryItems = [...items, ...items];

  return (
    <div
      className="credentials-marquee relative overflow-hidden"
      role="region"
      aria-label="Certification document placeholders"
    >
      <div className="credentials-marquee-track flex w-max gap-5 py-4">
        {galleryItems.map((credential, index) => (
          <figure
            key={`${credential.title}-${index}`}
            aria-hidden={index >= credentials.length || undefined}
            className="group/card h-[300px] w-[230px] shrink-0 overflow-hidden bg-neutral-100 sm:h-[340px] sm:w-[270px]"
          >
            <img
              src={credential.image}
              alt={index >= items.length ? "" : `${credential.title} document placeholder`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
