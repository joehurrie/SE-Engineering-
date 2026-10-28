"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ZoomIn, X, ExternalLink, ShieldCheck } from "lucide-react";

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
  const [activeItem, setActiveItem] = useState<{ title: string; image: string } | null>(null);

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    if (!activeItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveItem(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem]);

  // Ensure marquee has enough elements to loop seamlessly
  const validItems = items.filter((item) => Boolean(item.image && item.image.trim()));
  const baseItems = validItems.length > 0 ? validItems : credentials;
  const galleryItems = [...baseItems, ...baseItems, ...baseItems];

  return (
    <>
      <div
        className="credentials-marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        role="region"
        aria-label="Certification document gallery"
      >
        <div className="credentials-marquee-track flex w-max gap-6 py-6">
          {galleryItems.map((credential, index) => (
            <figure
              key={`${credential.title}-${index}`}
              aria-hidden={index >= baseItems.length || undefined}
              onClick={() => setActiveItem(credential)}
              className="group/card relative flex h-[350px] w-[250px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-none border border-neutral-200 bg-white p-3.5 shadow-sm transition-all duration-300 hover:border-blue-600 hover:shadow-xl sm:h-[400px] sm:w-[280px]"
            >
              {/* Document Frame Container - fits the document without cropping */}
              <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-neutral-50/70 p-2 border border-neutral-100">
                <img
                  src={credential.image}
                  alt={index >= baseItems.length ? "" : `${credential.title} document`}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover/card:scale-105"
                  loading="lazy"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-950/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover/card:opacity-100">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform duration-300 group-hover/card:scale-110">
                    <ZoomIn className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-white">
                    Click to Inspect
                  </span>
                </div>
              </div>

              {/* Caption Footer */}
              <figcaption className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2.5 text-left">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                    <p className="truncate text-xs font-semibold uppercase tracking-wide text-neutral-900">
                      {credential.title}
                    </p>
                  </div>
                  <p className="text-[10px] text-neutral-400">Official Document</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-blue-600 group-hover/card:underline">
                  View
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* High-Resolution Document Lightbox Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-none border border-neutral-700 bg-neutral-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-blue-600 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white sm:text-base">
                    {activeItem.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400">Official Compliance & Certification Document</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeItem.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:border-blue-500 hover:text-blue-400"
                  title="Open full size in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Open Full Size</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="flex h-9 w-9 items-center justify-center border border-neutral-700 bg-neutral-800 text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
                  aria-label="Close document viewer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Document fitting the full view height */}
            <div className="relative flex flex-1 items-center justify-center overflow-auto bg-neutral-900/40 p-4 sm:p-8">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[75vh] w-auto max-w-full rounded-sm object-contain shadow-2xl border border-neutral-800 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
