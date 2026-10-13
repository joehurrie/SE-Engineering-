"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ClipboardCheck,
  Clock3,
  DraftingCompass,
  Headphones,
  MapPin,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export type HomeProject = {
  projectName: string;
  imageUrl: string;
  projectType?: string;
  location?: string | null;
};

export type HomeProduct = {
  series: string;
  title: string;
  desc: string;
  specs: string;
  image: string;
  href: string;
};

export type HomePromotion = {
  title: string;
  description: string;
  features: string[];
  image: string;
};

const fallbackProducts: HomeProduct[] = [
  {
    series: "SERIES H-300",
    title: "Home lifts",
    desc: "Quiet, space-conscious lifts designed around the character and structure of private homes.",
    specs: "Residential · Bespoke cabin options",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=85&w=1400",
    href: "/elevators/home-lift",
  },
  {
    series: "SERIES P-800",
    title: "Passenger elevators",
    desc: "Efficient vertical transport for commercial towers, apartments, and mixed-use developments.",
    specs: "Commercial · Gearless traction",
    image: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=85&w=1400",
    href: "/elevators/passenger-elevator",
  },
  {
    series: "SERIES M-600",
    title: "Hospital lifts",
    desc: "Smooth, dependable movement for beds, clinical teams, and essential equipment.",
    specs: "Healthcare · Stretcher-ready",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=85&w=1400",
    href: "/elevators/hospital-elevator",
  },
  {
    series: "SERIES E-400",
    title: "Escalators",
    desc: "High-capacity people movement for retail, hospitality, and public transport environments.",
    specs: "Public spaces · Heavy transit duty",
    image: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=85&w=1400",
    href: "/elevators/escalator-moving-walk",
  },
];

const fallbackProjects: HomeProject[] = [
  {
    projectName: "Alina Harbor Apartments",
    projectType: "Residential elevator installation",
    location: "Kilimani, Nairobi",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=85&w=900",
  },
  {
    projectName: "Apple Tree Apartments",
    projectType: "Passenger elevator systems",
    location: "Westlands, Nairobi",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=85&w=900",
  },
  {
    projectName: "Urban Oasis Towers",
    projectType: "Mixed-use vertical transport",
    location: "Upper Hill, Nairobi",
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=85&w=900",
  },
  {
    projectName: "Zuri Villas",
    projectType: "Residential home lifts",
    location: "Karen, Nairobi",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=85&w=900",
  },
  {
    projectName: "Talanta Hela Complex",
    projectType: "Public transit escalator installation",
    location: "Nairobi CBD",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=85&w=900",
  },
  {
    projectName: "Greenpark Executive Offices",
    projectType: "Commercial passenger elevators",
    location: "Thika Road, Nairobi",
    imageUrl: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=85&w=900",
  },
];

function AnimatedMetric({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = document.querySelector<HTMLElement>(`[data-metric-value="${value}-${suffix}"]`);
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
  }, [started, suffix, value]);

  return (
    <span data-metric-value={`${value}-${suffix}`}>
      {new Intl.NumberFormat("en-US").format(displayValue)}{suffix}
    </span>
  );
}

const processSteps = [
  {
    number: "01",
    title: "Assessment",
    description: "We review shaft conditions, traffic needs, site constraints, and the architectural brief.",
    Icon: ClipboardCheck,
  },
  {
    number: "02",
    title: "Engineering",
    description: "Our specialists define system configuration, safety requirements, and installation details.",
    Icon: DraftingCompass,
  },
  {
    number: "03",
    title: "Installation",
    description: "In-house technicians assemble, test, and commission each system against the project plan.",
    Icon: Wrench,
  },
];

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

export function HomeMetricTransition({
  project,
  yearsInOperation,
}: {
  project: HomeProject;
  yearsInOperation: number;
}) {
  return (
    <section className="mt-32 bg-[#F5F5F3] pb-20 pt-0 font-sans tracking-normal md:pb-28">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-14 lg:px-8">
        <div data-home-reveal className="home-reveal order-2 md:order-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">
            Established in Nairobi, 2016
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">
            Engineering movement for more than {yearsInOperation} years.
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-[#D4D4D4] pt-6">
            <div>
              <p className="text-5xl font-semibold leading-none tracking-normal text-[#0F0F0F] sm:text-6xl">
                <AnimatedMetric value={200} suffix="+" />
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-600">elevators installed since 2016</p>
            </div>
            <div>
              <p className="text-5xl font-semibold leading-none tracking-normal text-[#0F0F0F] sm:text-6xl">
                <AnimatedMetric value={yearsInOperation} suffix="+" />
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-600">years in operation</p>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative mx-auto -mt-24 aspect-[2/3] w-full max-w-[460px] md:-mt-32">
            <div aria-hidden="true" className="absolute -right-3 -top-3 h-[82%] w-[82%] bg-[#2563EB] sm:-right-5 sm:-top-5" />
            <div className="relative h-full overflow-hidden border border-[#E5E5E5] bg-white">
              <Image src={project.imageUrl} alt={project.projectName} fill sizes="(min-width: 768px) 36vw, 90vw" className="object-cover" />
              <span className="absolute bottom-0 left-0 bg-[#0F0F0F] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                {project.projectName}
              </span>
            </div>
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
}: {
  systems: HomeProduct[];
  projects: HomeProject[];
  promotion: HomePromotion;
}) {
  const products = systems.length > 0 ? systems : fallbackProducts;
  const featuredProjects = (projects.length > 0 ? projects : fallbackProjects).slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const activeProduct = products[activeIndex % products.length];

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>("[data-home-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const showProduct = useCallback((offset: number) => {
    setActiveIndex((index) => (index + offset + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (shouldReduceMotion || products.length < 2) return;

    const timer = window.setInterval(() => showProduct(1), 5000);
    return () => window.clearInterval(timer);
  }, [products.length, shouldReduceMotion, showProduct]);

  return (
    <>
      <section id="systems" className="overflow-hidden bg-white py-20 font-sans tracking-normal md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-5 border-b border-[#E5E5E5] pb-6 text-center">
            <div data-home-reveal className="home-reveal">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Vertical transport systems</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">Engineered for every journey</h2>
            </div>
          </div>

          <div data-home-reveal className="home-reveal relative" aria-roledescription="carousel" aria-label="Elevator systems">
            <Link href={activeProduct.href} aria-label={`View more: ${activeProduct.title}`} className="group relative block h-[280px] w-full overflow-hidden border border-[#E5E5E5] bg-[#141414] sm:h-[380px] md:h-[520px]">
              <AnimatePresence initial={false} mode="sync">
                <motion.div key={`active-${activeIndex}`} initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -44 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: shouldReduceMotion ? 0 : 32 }} transition={{ duration: shouldReduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
                  <Image src={activeProduct.image} alt={activeProduct.title} fill sizes="(min-width: 768px) 70vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                </motion.div>
              </AnimatePresence>
              <span className="absolute inset-0 flex items-center justify-center bg-[#0F0F0F]/0 text-[11px] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition-all duration-300 group-hover:bg-[#0F0F0F]/20 group-hover:opacity-100 group-focus-visible:bg-[#0F0F0F]/20 group-focus-visible:opacity-100">View more <ArrowRight className="ml-2 h-4 w-4" /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 font-sans tracking-normal md:py-28">
        <div data-home-reveal className="home-reveal mx-auto w-full max-w-[1100px] px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Our commitment</p>
          <blockquote className="mx-auto mt-7 max-w-[1000px] text-3xl font-medium leading-[1.2] tracking-normal sm:text-4xl md:text-5xl lg:text-6xl">
            &ldquo;Specialized Engineering is committed to providing the highest engineering rigor in meeting your vertical transportation needs for the future.&rdquo;
          </blockquote>
          <div className="mx-auto mt-8 h-px w-20 bg-[#2563EB]" />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Specialized Engineering Kenya Ltd.</p>
        </div>
      </section>

      <section className="bg-[#F5F5F3] py-20 font-sans tracking-normal md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-12 max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">A considered process</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">From assessment to installation</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {processSteps.map(({ number, title, description, Icon }, index) => (
              <article key={number} data-home-reveal className="home-reveal rounded-none border border-[#E5E5E5] bg-white p-7 md:min-h-[300px] md:p-10" style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-6">
                  <span className="flex h-16 w-16 items-center justify-center border border-[#2563EB]/20 bg-[#2563EB]/5">
                    <Icon aria-hidden="true" className="h-9 w-9 text-[#2563EB]" strokeWidth={1.7} />
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400">{number}</span>
                </div>
                <h3 className="mt-7 text-2xl font-semibold tracking-normal text-[#0F0F0F]">{title}</h3>
                <p className="mt-4 text-base leading-7 text-neutral-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 font-sans tracking-normal md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-12 max-w-3xl text-center md:mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Selected projects</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">Projects in motion</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {featuredProjects.map((project, index) => (
              <article key={`${project.projectName}-${index}`} data-home-reveal className="home-reveal group flex h-full flex-col border border-[#E5E5E5] bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F3]">
                  <Image
                    src={project.imageUrl}
                    alt={project.projectName}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#2563EB]" />
                    {project.location || "Kenya"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-[#0F0F0F] transition-colors group-hover:text-[#2563EB]">{project.projectName}</h3>
                  {project.projectType && <p className="mt-2 text-sm leading-6 text-neutral-600">{project.projectType}</p>}
                  <Link
                    href="/projects"
                    className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 border border-[#0F0F0F] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0F0F0F] transition-colors hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                  >
                    Explore <ArrowRight aria-hidden="true" className="h-4 w-4" />
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

      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-neutral-100 py-20 font-sans tracking-normal text-neutral-900 md:py-28">
        <div className="home-reveal mx-auto grid w-full max-w-[1280px] overflow-hidden bg-neutral-100 md:grid-cols-[1.05fr_0.95fr]" data-home-reveal>
          <div className="flex flex-col justify-center px-6 py-9 sm:px-9 md:px-12 md:py-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">Beyond the standard range</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-normal text-neutral-900 sm:text-4xl">{promotion.title}, engineered around your architecture.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600">{promotion.description}</p>
            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {promotion.features.map((feature) => <li key={feature} className="flex items-center gap-3 text-sm text-neutral-700"><span className="h-1.5 w-1.5 shrink-0 bg-blue-600" />{feature}</li>)}
            </ul>
            <Link href="/contact" className="mt-8 inline-flex h-12 w-fit items-center gap-3 bg-blue-700 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-blue-800">
              Discuss a bespoke project <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative min-h-[280px] overflow-hidden md:min-h-[480px]">
            <Image src={promotion.image} alt="Bespoke elevator installation" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F3] py-20 font-sans tracking-normal md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-12 max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">The SE standard</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">Standards built into every project</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2 md:gap-6">
            <article data-home-reveal className="home-reveal rounded-none border border-[#E5E5E5] bg-white p-6 md:col-span-2 md:row-span-2 md:p-8">
              <ShieldCheck aria-hidden="true" className="h-8 w-8 text-[#2563EB]" />
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Quality and compliance</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-normal text-[#0F0F0F]">Certified installation standards</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600">Factory-aligned procedures, documented checks, and in-house technical oversight from assembly through handover.</p>
            </article>
            <article data-home-reveal className="home-reveal rounded-none border border-[#E5E5E5] bg-white p-6 md:col-span-2 md:p-8" style={{ transitionDelay: "100ms" }}>
              <Clock3 aria-hidden="true" className="h-7 w-7 text-[#2563EB]" />
              <h3 className="mt-5 text-xl font-semibold tracking-normal text-[#0F0F0F]">Commissioning timelines</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Clear milestones and coordinated site teams keep delivery aligned with project schedules.</p>
            </article>
            <article data-home-reveal className="home-reveal rounded-none border border-[#E5E5E5] bg-white p-6 md:p-8" style={{ transitionDelay: "200ms" }}>
              <Headphones aria-hidden="true" className="h-7 w-7 text-[#2563EB]" />
              <h3 className="mt-5 text-xl font-semibold tracking-normal text-[#0F0F0F]">24/7 response</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Standby technical support for urgent lift issues, day or night.</p>
            </article>
            <div data-home-reveal className="home-reveal flex flex-col justify-between rounded-none border border-[#E5E5E5] bg-[#141414] p-6 text-white md:p-8" style={{ transitionDelay: "300ms" }}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Our partner network</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="flex min-h-20 flex-col justify-center border border-white/15 px-3 py-3">
                    <span className="text-xl font-bold tracking-[0.08em] text-white">XIZI</span>
                    <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.1em] text-white/55">Manufacturing partner</span>
                  </div>
                  <div className="flex min-h-20 flex-col justify-center border border-white/15 px-3 py-3">
                    <span className="text-xl font-bold tracking-[0.06em] text-white">SE<span className="text-[#2563EB]">.</span></span>
                    <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.1em] text-white/55">Kenya engineering</span>
                  </div>
                </div>
              </div>
              <Link href="/about#certifications" className="mt-5 inline-flex min-h-11 items-center justify-between border-t border-white/15 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80 transition-colors hover:text-white">
                View our credentials <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 font-sans tracking-normal md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div data-home-reveal className="home-reveal mx-auto mb-12 max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">Client perspectives</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#0F0F0F] sm:text-4xl md:text-5xl">Trusted by professionals</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <article key={testimonial.name} data-home-reveal className="home-reveal rounded-none border border-[#E5E5E5] bg-white p-6 md:p-8" style={{ transitionDelay: `${index * 100}ms` }}>
                <p className="text-base leading-7 text-neutral-700">{testimonial.quote}</p>
                <div className="mt-7 flex items-center gap-4 border-t border-[#E5E5E5] pt-5">
                  <img src={testimonial.image} alt="" className="h-14 w-14 shrink-0 rounded-none border border-[#E5E5E5] object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-[#0F0F0F]">{testimonial.name}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">{testimonial.role}</p>
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