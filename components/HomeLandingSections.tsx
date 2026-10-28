"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Clock3,
  DraftingCompass,
  Headphones,
  MapPin,
  PackageCheck,
  Settings,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { HomeContentMap, HomeContentSection } from "@/lib/home-content";
import {
  servicePillars,
} from "@/lib/service-pillars";
import partnerLogo1 from "../app/(public)/Assets/logo-1.png";
import partnerLogo2 from "../app/(public)/Assets/logo-2.png";
import partnerLogo3 from "../app/(public)/Assets/logo-3.png";
import partnerLogo4 from "../app/(public)/Assets/logo-4.png";

export type HomeProject = {
  projectName: string;
  imageUrl: string;
  projectType?: string;
  location?: string | null;
  href?: string;
  category?: string;
  elevatorCount?: number;
  featured?: boolean;
  year?: string;
  status?: string;
};

export type HomeProduct = {
  series: string;
  title: string;
  desc: string;
  specs: string;
  image: string;
  fallbackImage?: string;
  href: string;
};

export type HomePromotion = {
  title: string;
  description: string;
  features: string[];
  video: string;
  image: string;
};

function ElevatorProductImage({ product, isClone }: { product: HomeProduct; isClone: boolean }) {
  return (
    <Image
      src={product.image}
      alt={isClone ? "" : product.title}
      fill
      quality={95}
      sizes="(max-width: 767px) 85vw, (min-width: 1400px) 600px, 450px"
      className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-105"
    />
  );
}

function AnimatedMetric({ value, suffix = "", id }: { value: number; suffix?: string; id: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = document.querySelector<HTMLElement>(`[data-metric-value="${id}-${value}-${suffix}"]`);
    if (!element || started) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStarted(true);
      observer.disconnect();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplayValue(value);
        return;
      }

      const startTime = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setDisplayValue(Math.round(value * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [id, started, suffix, value]);

  return (
    <span data-metric-value={`${id}-${value}-${suffix}`}>
      {new Intl.NumberFormat("en-US").format(displayValue)}{suffix}
    </span>
  );
}

const processSteps = servicePillars.map((service, index) => ({
  ...service,
  Icon: [PackageCheck, Wrench, Settings][index] || PackageCheck,
}));

const testimonials = [
  {
    quote: "Specialized Engineering installed 12 high-speed passenger elevators at Alina Harbor Towers on time. Their technical alignment and ride quality are world-class.",
    name: "Amit Kumar",
    role: "Commercial developer, Kilimani",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    quote: "As an architect, I need reliability in shaft dimensions and bespoke panoramic cabin finishes. The team delivers exactly what is specified in our drawings.",
    name: "Sarah Jenkins",
    role: "Principal architect, Nairobi",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    quote: "The custom glass home lift in our Karen villa operates quietly and fits seamlessly with the double-height living room. The installation was carefully managed.",
    name: "Rajesh M.",
    role: "Private villa owner, Karen",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=80",
  },
];

const commitmentQuote = "“Specialized Engineering is committed to providing the highest engineering rigor in meeting your vertical transportation needs for the future.”";

function renderCommitmentQuote(rawQuote: string) {
  const clean = rawQuote.replace(/[“”]/g, "").trim();
  return <span className="text-[#0F0F0F]">“{clean}”</span>;
}

const sectionText = (section: HomeContentSection | undefined, key: string, fallback: string) =>
  section?.[key]?.trim() || fallback;

const contentIcons: Record<string, LucideIcon> = {
  BadgeCheck,
  ClipboardCheck,
  Clock3,
  DraftingCompass,
  Headphones,
  PackageCheck,
  Settings,
  ShieldCheck,
  Wrench,
};

export function HomeMetricTransition({
  content,
}: {
  content?: HomeContentSection;
}) {
  const metrics = [
    {
      value: sectionText(content, "metric1Value", "54+"),
      label: sectionText(content, "metric1Label", "Engineers"),
    },
    {
      value: sectionText(content, "metric2Value", "10+"),
      label: sectionText(content, "metric2Label", "Elevator Manufacturing Companies"),
    },
    {
      value: sectionText(content, "metric3Value", "500+"),
      label: sectionText(content, "metric3Label", "Elevators Installed"),
    },
    {
      value: sectionText(content, "metric4Value", "10+"),
      label: sectionText(content, "metric4Label", "Years of Experience"),
    },
  ];

  return (
    <section className="bg-white py-14 font-sans tracking-normal md:py-20">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div data-home-reveal className="home-reveal">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">
            {sectionText(content, "subtitle", "OUR IMPACT")}
          </p>
          <h2 className="mt-3 text-center text-2xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-3xl">
            {sectionText(content, "title", "Engineering movement at every level")}
          </h2>
          <div className="mt-8 grid grid-cols-2 border-y border-[#E5E5E5] lg:grid-cols-4">
            {metrics.map((metric, index) => {
              const numberAndSuffix = metric.value.match(/^(\d+)(.*)$/);
              return (
                <div
                  key={metric.label}
                  className={`px-5 py-7 text-center md:px-8 md:py-9 ${index % 2 ? "border-l border-[#E5E5E5] lg:border-t-0" : ""} ${index >= 2 ? "border-t border-[#E5E5E5] lg:border-t-0" : ""} ${index > 0 ? "lg:border-l" : ""}`}
                >
                  <p className="text-4xl font-semibold leading-none tracking-normal text-[#0F0F0F] sm:text-5xl md:text-6xl">
                    {numberAndSuffix ? (
                      <AnimatedMetric id={index} value={Number(numberAndSuffix[1])} suffix={numberAndSuffix[2]} />
                    ) : metric.value}
                  </p>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-neutral-500">{metric.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeLandingSections({
  systems,
  projects,
  promotion,
  content,
  commitmentBackground,
}: {
  systems: HomeProduct[];
  projects: HomeProject[];
  promotion: HomePromotion;
  content: HomeContentMap;
  commitmentBackground: string;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [visibleCardCount, setVisibleCardCount] = useState(3);
  const [selectedMobileCard, setSelectedMobileCard] = useState<number | null>(null);
  const systemsContent = content.home_systems;
  const products = systems.map((product, index) => ({
    ...product,
    title: sectionText(systemsContent, `product${index + 1}Title`, product.title),
    desc: sectionText(systemsContent, `product${index + 1}Description`, product.desc),
    image: sectionText(systemsContent, `product${index + 1}Image`, product.image),
    href: sectionText(systemsContent, `product${index + 1}Href`, product.href),
  }));
  const featuredProjects = projects.filter((p) => Boolean(p.imageUrl && p.imageUrl.trim())).slice(0, 6);
  const projectsHeading = sectionText(content.home_projects, "title", "Our Projects") === "Projects in motion"
    ? "Our Projects"
    : sectionText(content.home_projects, "title", "Our Projects");
  const fallbackPartnerLogos = [
    { number: 1, name: "XIZI", descriptor: "Elevator manufacturing partner", image: partnerLogo4, href: "" },
    { number: 2, name: "Manufacturing partner", descriptor: "International elevator systems", image: partnerLogo1, href: "" },
    { number: 3, name: "Manufacturing partner", descriptor: "International elevator systems", image: partnerLogo2, href: "" },
    { number: 4, name: "Manufacturing partner", descriptor: "International elevator systems", image: partnerLogo3, href: "" },
  ];
  const partnerLogos = Array.from({ length: 8 }, (_, index) => {
    const number = index + 1;
    return {
      number,
      name: content.home_partners?.[`partner${number}Name`] || "",
      descriptor: content.home_partners?.[`partner${number}Description`] || "",
      image: content.home_partners?.[`partner${number}Image`] || "",
      href: content.home_partners?.[`partner${number}Href`] || "",
    };
  })
    .filter((partner) => partner.name || partner.image)
    .map((partner) => ({
      ...partner,
      name: partner.name || `Partner ${partner.number}`,
      descriptor: partner.descriptor || "Elevator manufacturing partner",
      image: partner.image || fallbackPartnerLogos[(partner.number - 1) % fallbackPartnerLogos.length].image,
    }));
  const visiblePartnerLogos = partnerLogos.length > 0
    ? partnerLogos
    : fallbackPartnerLogos;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
      setVisibleCardCount(mediaQuery.matches ? 1 : 3);
      setCurrentSlide(0);
      setIsCarouselPaused(false);
      setSelectedMobileCard(null);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (
      products.length <= 3 ||
      isMobileViewport ||
      isCarouselPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const intervalId = window.setInterval(() => {
      setCurrentSlide((current) => current + 1);
    }, 8000);
    return () => window.clearInterval(intervalId);
  }, [isCarouselPaused, isMobileViewport, products.length]);

  useEffect(() => {
    if (currentSlide !== products.length) return;
    setCurrentSlide(0);
  }, [currentSlide, products.length]);

  useEffect(() => {
    const standardItems = document.querySelectorAll<HTMLElement>("[data-home-reveal]:not([data-home-reveal-instant])");
    const instantItems = document.querySelectorAll<HTMLElement>("[data-home-reveal-instant]");

    const standardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            standardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );

    const instantObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            instantObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px 80px 0px" }
    );

    standardItems.forEach((item) => standardObserver.observe(item));
    instantItems.forEach((item) => instantObserver.observe(item));

    return () => {
      standardObserver.disconnect();
      instantObserver.disconnect();
    };
  }, []);

  return (
    <>
      <section id="systems" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white mb-28 md:mb-40 lg:mb-48 pb-12 sm:pb-16 md:pb-20 font-sans tracking-normal border-b border-neutral-200">
        <div className="flex flex-col">
          <div className="shrink-0 px-4 pt-8 pb-4 text-center sm:pt-10 sm:pb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2563EB]">{sectionText(systemsContent, "subtitle", "Vertical transport systems")}</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-[#0F0F0F] sm:text-3xl md:text-4xl">{sectionText(systemsContent, "title", "Engineered for every journey")}</h2>
          </div>
          <div
            className="systems-carousel relative min-h-0 flex-1 overflow-hidden pb-8 sm:pb-12 pt-2"
            aria-roledescription="carousel"
            aria-label="Elevator systems"
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse" && !isMobileViewport) setIsCarouselPaused(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse" && !isMobileViewport) setIsCarouselPaused(false);
            }}
            onFocusCapture={() => setIsCarouselPaused(true)}
            onBlurCapture={(event) => {
              if (!(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))) {
                setIsCarouselPaused(false);
              }
            }}
          >
            <div
              className={`systems-carousel-track flex w-max items-center ${isCarouselPaused ? "is-paused" : ""} ${products.length <= 3 ? "is-static" : ""}`}
              style={{
                animationDuration: isMobileViewport ? "32s" : `${Math.max(products.length * 8, 48)}s`,
              }}
            >
              {[...products, ...products].map((product, index) => {
                const isVisible = index >= currentSlide && index < currentSlide + visibleCardCount;
                return (
                  <div
                    key={`${product.title}-${index}`}
                    aria-hidden={!isVisible}
                    className="systems-carousel-card group relative flex-none px-3 sm:px-4 md:px-5 w-[85vw] sm:w-[340px] md:w-[380px] lg:w-[400px]"
                  >
                    <div className="relative flex flex-col aspect-square w-full overflow-hidden border border-neutral-200 bg-white rounded-none transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:z-30 group-hover:shadow-2xl group-hover:border-[#2563EB]">
                      {/* Image-Only Default (Clean full cover with zero text clutter) */}
                      <div className="relative w-full h-full overflow-hidden bg-neutral-100">
                        <ElevatorProductImage product={product} isClone={!isVisible} />
                      </div>

                      {/* White Almost-Glassmorphism Overlay (News-card style hover reveal) */}
                      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-white/95 backdrop-blur-md p-5 sm:p-6 border-t border-neutral-200/60 shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-400 ease-out pointer-events-none group-hover:pointer-events-auto">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                          {product.series}
                        </span>
                        <h3 className="mt-1 text-base sm:text-lg font-bold text-[#2563EB] tracking-tight leading-snug">
                          {product.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm text-neutral-800 line-clamp-2 leading-relaxed font-normal">
                          {product.desc}
                        </p>
                        <div className="mt-3 flex items-center justify-between border-t border-neutral-200/80 pt-2.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                            ISO Certified
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB] transition-colors group-hover:text-blue-700">
                            Explore <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>

                      <Link
                        href={product.href}
                        aria-label={`Explore ${product.title}`}
                        tabIndex={isVisible ? undefined : -1}
                        className="absolute inset-0 z-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#2563EB]"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="commitment-section relative isolate flex min-h-[60vh] items-center overflow-hidden bg-[#F5F5F3] py-20 font-sans tracking-normal md:h-[80vh] md:min-h-0 md:py-0 border-b border-neutral-200">
        <div data-home-reveal data-home-reveal-instant className="home-reveal relative z-10 mx-auto w-full max-w-[1100px] px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0F0F0F]">{sectionText(content.home_commitment, "subtitle", "Our commitment")}</p>
          <blockquote aria-label={sectionText(content.home_commitment, "bodyText", commitmentQuote)} className="commitment-quote mx-auto mt-7 max-w-[1000px] text-3xl font-medium leading-[1.25] tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl lg:text-6xl">
            {renderCommitmentQuote(sectionText(content.home_commitment, "bodyText", commitmentQuote))}
          </blockquote>
          <div className="mx-auto mt-8 h-1 w-20 bg-[#0F0F0F]" />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0F0F0F]">Specialized Engineering Kenya Ltd.</p>
        </div>
      </section>

      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white py-16 font-sans tracking-normal text-neutral-900 md:py-24">
        <div className="relative mx-auto flex min-h-[520px] w-full max-w-[1440px] items-center px-4 sm:px-8 lg:px-12" data-home-reveal>
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={promotion.video}
            poster={promotion.image}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="home-reveal relative z-10 w-full max-w-2xl border border-white/70 bg-white/90 p-6 shadow-lg backdrop-blur-sm sm:p-9 md:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">{sectionText(content.home_video_banner, "subtitle", "Beyond the standard range")}</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-normal text-neutral-900 sm:text-4xl">{sectionText(content.home_video_banner, "title", "Elevator solutions, engineered for every journey.")}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600">{sectionText(content.home_video_banner, "bodyText", promotion.description)}</p>
            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {promotion.features.map((feature) => <li key={feature} className="flex items-center gap-3 text-sm text-neutral-700"><span className="h-1.5 w-1.5 shrink-0 bg-[#2563EB]" />{feature}</li>)}
            </ul>
            <Link href={sectionText(content.home_video_banner, "buttonHref", "/contact")} className="mt-8 inline-flex h-12 w-fit items-center gap-3 rounded-none border border-[#E5E5E5] bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0F0F0F] transition-colors hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white active:border-[#2563EB] active:bg-[#2563EB] active:text-white">
              {sectionText(content.home_video_banner, "buttonLabel", "Get started")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 font-sans tracking-normal md:py-28 border-b border-neutral-100">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-12 max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">{sectionText(content.home_services, "subtitle", "END-TO-END LIFT LIFECYCLE")}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">{sectionText(content.home_services, "title", "Three services. One accountable partner.")}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-600">
              One engineering partner from system selection and installation to ongoing care.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {processSteps.map(({ number, title, description, Icon: DefaultIcon }, index) => {
              const Icon = contentIcons[content.home_services?.[`service${index + 1}Icon`] || ""] || DefaultIcon;
              return (
                <article
                  key={number}
                  data-home-reveal
                  className="home-reveal group flex flex-col justify-between overflow-hidden rounded-none border border-neutral-200 bg-white p-6 md:p-8 transition-all duration-300 hover:border-blue-600/40 hover:shadow-xl"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
                      <span className="flex h-12 w-12 items-center justify-center rounded-none border border-blue-600/20 bg-blue-50/50 text-blue-600">
                        <Icon aria-hidden="true" className="h-6 w-6 text-[#2563EB]" strokeWidth={1.8} />
                      </span>
                      <span className="text-[11px] font-mono font-bold tracking-[0.16em] text-neutral-400">{number}</span>
                    </div>
                    <span className="mt-6 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#2563EB]">
                      Pillar 0{index + 1}
                    </span>
                    <h3 className="mt-2 text-xl font-bold tracking-tight text-neutral-900 group-hover:text-blue-600 transition-colors">
                      {sectionText(content.home_services, `service${index + 1}Title`, title)}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600 font-light line-clamp-3">
                      {sectionText(content.home_services, `service${index + 1}Description`, description)}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-neutral-100 pt-4">
                    <Link
                      href={`/lift-services#${servicePillars[index].slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-900 transition-colors group-hover:text-[#2563EB]"
                    >
                      Learn more <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#2563EB] transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 font-sans tracking-normal md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-12 max-w-3xl text-center md:mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">{sectionText(content.home_projects, "subtitle", "Selected projects")}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">{projectsHeading}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {featuredProjects.map((project, index) => (
              <article key={`${project.projectName}-${index}`} data-home-reveal className="home-reveal group flex h-full flex-col overflow-hidden border border-neutral-200 bg-white transition-all duration-300 hover:border-blue-600/40 hover:shadow-xl">
                <div className="relative aspect-[4/3] md:aspect-auto md:h-80 lg:h-[380px] overflow-hidden bg-neutral-100">
                  <Image
                    src={project.imageUrl}
                    alt={project.projectName}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    quality={95}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3 text-xs text-white drop-shadow">
                    <span className="flex min-w-0 items-center gap-1 truncate">
                      <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                      <span className="truncate">{project.location || "Nairobi, Kenya"}</span>
                    </span>
                    {project.year && <span className="shrink-0 font-mono text-neutral-300">{project.year}</span>}
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-between gap-4 p-5 md:p-6">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] font-bold uppercase tracking-wider text-blue-600">
                        {project.category || "Project"}
                      </span>
                    </div>
                    <h3 className="truncate text-lg font-semibold leading-snug text-[#0F0F0F] transition-colors group-hover:text-[#2563EB]">
                      {project.projectName}
                    </h3>
                    <p className="mt-2 truncate text-sm leading-6 text-neutral-600">
                      {project.projectType || project.location || "Kenya"}
                    </p>
                  </div>
                  <Link
                    href={project.href || "/projects"}
                    aria-label={`Explore project: ${project.projectName}`}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-neutral-500 transition-colors hover:text-[#2563EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                  >
                    <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600 transition-colors hover:text-[#2563EB]">
              View more projects <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>



      <section className="bg-white py-20 font-sans tracking-normal md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-12 max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">{sectionText(content.home_standards, "subtitle", "The SE standard")}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">{sectionText(content.home_standards, "title", "Standards built into every project")}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2 md:gap-6">
            <article data-home-reveal className="home-reveal rounded-none border border-[#E5E5E5] bg-white p-6 md:col-span-2 md:row-span-2 md:p-8">
              {(() => {
                const Icon = contentIcons[content.home_standards?.certificationIcon || ""] || ShieldCheck;
                return <Icon aria-hidden="true" className="h-9 w-9 text-[#2563EB]" strokeWidth={1.7} />;
              })()}
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Quality and compliance</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-normal text-[#0F0F0F]">{sectionText(content.home_standards, "certificationTitle", "Certified installation & quality standards")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600">{sectionText(content.home_standards, "certificationDescription", "Factory-aligned procedures, documented checks, and in-house technical oversight from assembly through handover.")}</p>
            </article>
            <article data-home-reveal className="home-reveal rounded-none border border-[#E5E5E5] bg-white p-6 md:col-span-2 md:p-8" style={{ transitionDelay: "100ms" }}>
              {(() => {
                const Icon = contentIcons[content.home_standards?.commissioningIcon || ""] || Clock3;
                return <Icon aria-hidden="true" className="h-9 w-9 text-[#2563EB]" strokeWidth={1.7} />;
              })()}
              <h3 className="mt-5 text-xl font-semibold tracking-normal text-[#0F0F0F]">{sectionText(content.home_standards, "commissioningTitle", "Commissioning timelines")}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{sectionText(content.home_standards, "commissioningDescription", "Clear milestones and coordinated site teams keep delivery aligned with project schedules.")}</p>
            </article>
            <article data-home-reveal className="home-reveal rounded-none border border-[#E5E5E5] bg-white p-6 md:p-8" style={{ transitionDelay: "200ms" }}>
              {(() => {
                const Icon = contentIcons[content.home_standards?.emergencyIcon || ""] || Headphones;
                return <Icon aria-hidden="true" className="h-9 w-9 text-[#2563EB]" strokeWidth={1.7} />;
              })()}
              <h3 className="mt-5 text-xl font-semibold tracking-normal text-[#0F0F0F]">{sectionText(content.home_standards, "emergencyTitle", "Rapid 24/7 emergency response")}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{sectionText(content.home_standards, "emergencyDescription", "Standby technical support for urgent lift issues, day or night.")}</p>
            </article>
            <div data-home-reveal className="home-reveal flex flex-col justify-center rounded-none border border-[#E5E5E5] bg-[#F5F5F3] p-6 md:p-8" style={{ transitionDelay: "300ms" }}>
              <BadgeCheck aria-hidden="true" className="h-9 w-9 text-[#2563EB]" strokeWidth={1.7} />
              <p className="mt-4 text-sm leading-6 text-neutral-600">Review our credentials, safety processes and quality commitments.</p>
              <Link href={sectionText(content.home_standards, "buttonHref", "/about#certifications")} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-none border border-[#E5E5E5] bg-white px-4 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#0F0F0F] transition-colors hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white active:border-[#2563EB] active:bg-[#2563EB] active:text-white">
                {sectionText(content.home_standards, "buttonLabel", "View our certifications")} <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#F5F5F3] py-24 font-sans tracking-normal md:py-32">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mb-12 flex flex-col items-center gap-3 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">{sectionText(content.home_partners, "subtitle", "Trusted collaboration")}</p>
            <h2 className="text-2xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-3xl">{sectionText(content.home_partners, "title", "Our Partners Network")}</h2>
          </div>
          <div role="region" className="partners-marquee relative overflow-hidden border-y border-[#E5E5E5] py-4" aria-label="Our partner logos">
            <div className="partners-marquee-track flex w-max items-center">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex w-max items-center" aria-hidden={copy === 1 || undefined}>
                  {visiblePartnerLogos.map(({ number, name, descriptor, image: logo, href }) => (
                    <a
                      key={`${copy}-${number}-${name}`}
                      href={href || undefined}
                      aria-label={descriptor ? `${name} — ${descriptor}` : name}
                      tabIndex={copy ? -1 : undefined}
                      className="mx-3 flex min-h-24 min-w-48 flex-col items-center justify-center border border-[#E5E5E5] bg-white px-6 py-4 text-center sm:min-w-56"
                    >
                      <Image src={logo} alt={`${name} logo`} width={160} height={64} className="h-12 w-40 object-contain" />
                      {descriptor && <span className="mt-2 text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-500">{descriptor}</span>}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F3] py-24 font-sans tracking-normal md:py-32">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-16 max-w-3xl text-center md:mb-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">{sectionText(content.home_testimonials, "subtitle", "Client perspectives")}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">{sectionText(content.home_testimonials, "title", "Trusted by professionals")}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <article key={sectionText(content.home_testimonials, `name${index + 1}`, testimonial.name)} data-home-reveal className="home-reveal rounded-none border border-[#E5E5E5] bg-white p-7 md:p-10" style={{ transitionDelay: `${index * 100}ms` }}>
                <p className="text-base leading-7 text-neutral-700">{sectionText(content.home_testimonials, `quote${index + 1}`, testimonial.quote)}</p>
                <div className="mt-7 flex items-center gap-4 border-t border-[#E5E5E5] pt-5">
                  <Image
                    src={sectionText(content.home_testimonials, `image${index + 1}`, testimonial.image)}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-none border border-[#E5E5E5] object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#0F0F0F]">{sectionText(content.home_testimonials, `name${index + 1}`, testimonial.name)}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">{sectionText(content.home_testimonials, `role${index + 1}`, testimonial.role)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}