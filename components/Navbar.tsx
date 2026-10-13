"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown, ArrowRight, Menu } from "lucide-react";

const elevatorItems = [
  { label: "Home Lift",                      href: "/elevators/home-lift" },
  { label: "Passenger Elevator",             href: "/elevators/passenger-elevator" },
  { label: "Escalator & Moving Walk",        href: "/elevators/escalator-moving-walk" },
  { label: "Panoramic Elevator",             href: "/elevators/panoramic-elevator" },
  { label: "Hospital Elevator",              href: "/elevators/hospital-elevator" },
  { label: "Freight Elevator & Car Elevator",href: "/elevators/freight-car-elevator" },
  { label: "Dumbwaiter",                     href: "/elevators/dumbwaiter" },
  { label: "Hydraulic Platform",             href: "/elevators/hydraulic-platform" },
];

const serviceItems = [
  { label: "Spare Parts Supply",       href: "/lift-services/spare-parts" },
  { label: "Lift Modernization",       href: "/lift-services/lift-modernization" },
  { label: "Solution Customization",   href: "/lift-services/solution-customization" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [elevatorsOpen, setElevatorsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  const elevatorsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setElevatorsOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (elevatorsRef.current && !elevatorsRef.current.contains(e.target as Node)) {
        setElevatorsOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      {/* ── Fixed Header (Nexia Layout & Aesthetic) ─────────────── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-neutral-800 py-3 shadow-lg"
            : "bg-black/80 backdrop-blur-sm border-b border-white/10 py-4 md:py-5"
        }`}
      >
        <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16 h-14 flex items-center justify-between">
          {/* Brand Mark (Sharp Nexia Box) */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white font-bold tracking-tighter text-sm rounded-none">
                SE
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-bold tracking-tight text-base group-hover:text-neutral-300 transition-colors">
                  SPECIALIZED
                </span>
                <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-medium -mt-1">
                  Engineering Kenya
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Horizontal Menu (Centered 100% Width) */}
          <nav className="hidden lg:flex items-center justify-center gap-8 flex-none">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-blue-500 font-semibold"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "text-blue-500 font-semibold"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              About
            </Link>

            {/* Elevators Dropdown */}
            <div
              ref={elevatorsRef}
              className="relative"
              onMouseEnter={() => setElevatorsOpen(true)}
              onMouseLeave={() => setElevatorsOpen(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer py-1">
                <Link
                  href="/elevators"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/elevators")
                      ? "text-blue-500 font-semibold"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  Elevators
                </Link>
                <button
                  type="button"
                  onClick={() => setElevatorsOpen(!elevatorsOpen)}
                  aria-label="Toggle elevator categories menu"
                  className="text-neutral-400 hover:text-white"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      elevatorsOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
              </div>

              {elevatorsOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#111111] border border-neutral-800 shadow-2xl p-2 grid grid-cols-1 gap-1 animate-fade-in-up">
                  <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                      Our Elevator Systems
                    </span>
                  </div>
                  {elevatorItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-neutral-800 mt-1">
                    <Link
                      href="/elevators"
                      className="text-xs uppercase tracking-wider text-blue-500 hover:text-blue-400 font-semibold px-3 py-1.5 block"
                    >
                      View All Elevators →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Lift Services Dropdown */}
            <div
              ref={servicesRef}
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer py-1">
                <Link
                  href="/lift-services"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/lift-services")
                      ? "text-blue-500 font-semibold"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  Services
                </Link>
                <button
                  type="button"
                  onClick={() => setServicesOpen(!servicesOpen)}
                  aria-label="Toggle lift services menu"
                  className="text-neutral-400 hover:text-white"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      servicesOpen ? "rotate-180 text-white" : ""
                    }`}
                  />
                </button>
              </div>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#111111] border border-neutral-800 shadow-2xl p-2 grid grid-cols-1 gap-1 animate-fade-in-up">
                  <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                      Engineering Services
                    </span>
                  </div>
                  {serviceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-neutral-800 mt-1">
                    <Link
                      href="/lift-services"
                      className="text-xs uppercase tracking-wider text-blue-500 hover:text-blue-400 font-semibold px-3 py-1.5 block"
                    >
                      Explore Services →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/projects"
              className={`text-sm font-medium transition-colors ${
                isActive("/projects")
                  ? "text-blue-500 font-semibold"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              Projects
            </Link>

            <Link
              href="/news"
              className={`text-sm font-medium transition-colors ${
                isActive("/news")
                  ? "text-blue-500 font-semibold"
                  : "text-neutral-300 hover:text-white"
              }`}
            >
              News
            </Link>
          </nav>

          {/* Right: Sharp Nexia CTA Button */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <Link
              href="/contact"
              className="hidden sm:flex group px-5 py-2.5 rounded-none bg-neutral-900 border border-neutral-700 hover:bg-blue-600 hover:border-blue-600 text-white text-xs font-semibold uppercase tracking-wide transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Get Quote
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white hover:text-neutral-300 transition-colors"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay (Clean & Sharp) ──────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/98 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-8 text-white animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white font-bold text-xs rounded-none">
                SE
              </div>
              <span className="font-bold tracking-tight text-base uppercase">
                Specialized Engineering
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-neutral-400 hover:text-white"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="py-8 overflow-y-auto space-y-5 flex flex-col items-center text-center">
            {[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Elevators", href: "/elevators" },
              { label: "Lift Services", href: "/lift-services" },
              { label: "Projects", href: "/projects" },
              { label: "News", href: "/news" },
              { label: "Contact Us", href: "/contact" },
            ].map((item) => (
              <div key={item.href} className="w-full text-center border-b border-neutral-800/80 pb-3">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl font-medium tracking-tight block ${
                    isActive(item.href)
                      ? "text-blue-500 font-semibold"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-800 pt-6 flex flex-col items-center justify-center text-center gap-2 text-xs text-neutral-500">
            <p>Kilimani Business Hub, Nairobi</p>
            <p>+254 116 000 100</p>
          </div>
        </div>
      )}
    </>
  );
}
