"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown, ArrowRight, Menu } from "lucide-react";

const elevatorItems = [
  { label: "All Elevator Products", href: "/elevators" },
  { label: "Browse Lifts", href: "/elevators?category=lifts" },
  { label: "Home Lift", href: "/elevators?category=home-lift" },
  { label: "Passenger Elevator", href: "/elevators?category=passenger-elevator" },
  { label: "Escalator & Moving Walk", href: "/elevators?category=escalator-moving-walk" },
  { label: "Panoramic Elevator", href: "/elevators?category=panoramic-elevator" },
  { label: "Hospital Elevator", href: "/elevators?category=hospital-elevator" },
  { label: "Freight Elevator & Car Elevator", href: "/elevators?category=freight-car-elevator" },
  { label: "Dumbwaiter", href: "/elevators?category=dumbwaiter" },
  { label: "Hydraulic Platform", href: "/elevators?category=hydraulic-platform" },
  { label: "Spare Parts", href: "/elevators#spare-parts" },
];

const serviceItems = [
  { label: "Supply", href: "/lift-services#supply" },
  { label: "Installation", href: "/lift-services#installation" },
  { label: "Maintenance", href: "/lift-services#maintenance" },
];

function NavbarContent({ pathname }: { pathname: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [elevatorsOpen, setElevatorsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const elevatorsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const elevatorsCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openElevatorsMenu = () => {
    if (elevatorsCloseTimeout.current) {
      clearTimeout(elevatorsCloseTimeout.current);
      elevatorsCloseTimeout.current = null;
    }
    setElevatorsOpen(true);
  };

  const closeElevatorsMenu = () => {
    if (elevatorsCloseTimeout.current) clearTimeout(elevatorsCloseTimeout.current);
    elevatorsCloseTimeout.current = setTimeout(() => {
      setElevatorsOpen(false);
      elevatorsCloseTimeout.current = null;
    }, 220);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (elevatorsRef.current && !elevatorsRef.current.contains(e.target as Node)) {
        if (elevatorsCloseTimeout.current) {
          clearTimeout(elevatorsCloseTimeout.current);
          elevatorsCloseTimeout.current = null;
        }
        setElevatorsOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => () => {
    if (elevatorsCloseTimeout.current) clearTimeout(elevatorsCloseTimeout.current);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      {/* ── Fixed Header ─────────────── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm py-3"
            : "bg-transparent border-b border-white/10 py-4 md:py-5"
        }`}
      >
        <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16 h-14 flex items-center justify-between">
          {/* Brand Mark */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/se-logo.jpeg"
                alt="Specialized Engineering Kenya Ltd."
                width={36}
                height={36}
                className="object-contain rounded-none"
                style={{ display: "block" }}
              />
              <div className="flex flex-col text-left">
                <span className={`font-bold tracking-tight text-base transition-colors group-hover:text-[#2563EB] ${scrolled ? "text-neutral-900" : "text-white"}`}>
                  SPECIALIZED
                </span>
                <span className={`text-[10px] tracking-widest uppercase font-medium -mt-1 transition-colors ${scrolled ? "text-neutral-500" : "text-white/70"}`}>
                  Engineering Kenya
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Horizontal Menu */}
          <nav className="hidden lg:flex items-center justify-center gap-8 flex-none">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-[#2563EB] font-semibold"
                  : scrolled ? "text-neutral-900 hover:text-[#2563EB]" : "text-white/90 hover:text-white"
              }`}
            >
              Home
            </Link>

            <Link
              href="/projects"
              className={`text-sm font-medium transition-colors ${
                isActive("/projects")
                  ? "text-[#2563EB] font-semibold"
                  : scrolled ? "text-neutral-900 hover:text-[#2563EB]" : "text-white/90 hover:text-white"
              }`}
            >
              Projects
            </Link>

            {/* Elevators Dropdown */}
            <div
              ref={elevatorsRef}
              className="relative"
              onMouseEnter={openElevatorsMenu}
              onMouseLeave={closeElevatorsMenu}
            >
              <div className="flex items-center gap-1 cursor-pointer py-1">
                <Link
                  href="/elevators"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/elevators")
                      ? "text-[#2563EB] font-semibold"
                      : scrolled ? "text-neutral-900 hover:text-[#2563EB]" : "text-white/90 hover:text-white"
                  }`}
                >
                  Elevators
                </Link>
                <button
                  type="button"
                  onClick={() => (elevatorsOpen ? closeElevatorsMenu() : openElevatorsMenu())}
                  aria-label="Toggle elevator categories menu"
                  aria-expanded={elevatorsOpen}
                  className={`transition-colors ${scrolled ? "text-neutral-500 hover:text-[#2563EB]" : "text-white/60 hover:text-white"}`}
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      elevatorsOpen ? "rotate-180 text-[#2563EB]" : ""
                    }`}
                  />
                </button>
              </div>

              {elevatorsOpen && (
                <div className="absolute left-0 top-full z-50 w-72 pt-2">
                  <div className="grid grid-cols-1 gap-1 border border-neutral-200 bg-white p-2 shadow-lg animate-fade-in-up">
                  <div className="px-3 py-2 border-b border-neutral-200 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                      Our Elevator Systems
                    </span>
                  </div>
                  {elevatorItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-3 py-2 text-sm text-neutral-800 hover:text-[#2563EB] hover:bg-neutral-50 transition-colors flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-neutral-200 mt-1">
                    <Link
                      href="/elevators"
                      className="text-xs uppercase tracking-wider text-blue-500 hover:text-blue-400 font-semibold px-3 py-1.5 block"
                    >
                      View All Elevators →
                    </Link>
                  </div>
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
                      ? "text-[#2563EB] font-semibold"
                      : scrolled ? "text-neutral-900 hover:text-[#2563EB]" : "text-white/90 hover:text-white"
                  }`}
                >
                  Services
                </Link>
                <button
                  type="button"
                  onClick={() => setServicesOpen(!servicesOpen)}
                  aria-label="Toggle lift services menu"
                  className={`transition-colors ${scrolled ? "text-neutral-500 hover:text-[#2563EB]" : "text-white/60 hover:text-white"}`}
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      servicesOpen ? "rotate-180 text-[#2563EB]" : ""
                    }`}
                  />
                </button>
              </div>

              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-neutral-200 shadow-lg p-2 grid grid-cols-1 gap-1 animate-fade-in-up">
                  <div className="px-3 py-2 border-b border-neutral-200 mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                      Engineering Services
                    </span>
                  </div>
                  {serviceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-3 py-2 text-sm text-neutral-800 hover:text-[#2563EB] hover:bg-neutral-50 transition-colors flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>
                  ))}
                  <div className="pt-2 border-t border-neutral-200 mt-1">
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
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "text-[#2563EB] font-semibold"
                  : scrolled ? "text-neutral-900 hover:text-[#2563EB]" : "text-white/90 hover:text-white"
              }`}
            >
              About
            </Link>

            <Link
              href="/news"
              className={`text-sm font-medium transition-colors ${
                isActive("/news")
                  ? "text-[#2563EB] font-semibold"
                  : scrolled ? "text-neutral-900 hover:text-[#2563EB]" : "text-white/90 hover:text-white"
              }`}
            >
              News
            </Link>

            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors ${
                isActive("/contact")
                  ? "text-[#2563EB] font-semibold"
                  : scrolled ? "text-neutral-900 hover:text-[#2563EB]" : "text-white/90 hover:text-white"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right: CTA Button */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <Link
              href="/contact#form"
              className={`hidden sm:flex group px-5 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wide transition-all duration-300 border ${
                scrolled
                  ? "bg-white border-[#E5E5E5] text-[#0F0F0F] hover:bg-[#2563EB] hover:border-[#2563EB] hover:text-white"
                  : "bg-white/10 border-white/30 text-white hover:bg-white hover:border-white hover:text-[#0F0F0F]"
              }`}
            >
              <span className="flex items-center gap-2">
                Get Quote
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 transition-colors ${scrolled ? "text-neutral-900 hover:text-[#2563EB]" : "text-white hover:text-white/70"}`}
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay (Clean & Sharp) ──────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-white p-6 text-neutral-900 animate-fade-in-up sm:p-8">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div className="flex items-center gap-2">
              <img
                src="/se-logo.jpeg"
                alt="Specialized Engineering Kenya Ltd."
                width={32}
                height={32}
                className="object-contain rounded-none"
                style={{ display: "block" }}
              />
              <span className="font-bold tracking-tight text-base uppercase">
                Specialized Engineering
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-neutral-500 hover:text-[#2563EB]"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="py-8 overflow-y-auto space-y-5 flex flex-col items-center text-center">
            {[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/projects" },
              { label: "Elevators", href: "/elevators" },
              { label: "Services", href: "/lift-services" },
              { label: "About", href: "/about" },
              { label: "News", href: "/news" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <div key={item.href} className="w-full text-center border-b border-neutral-200 pb-3">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl font-medium tracking-tight block ${
                    isActive(item.href)
                      ? "text-[#2563EB] font-semibold"
                      : "text-neutral-900 hover:text-[#2563EB]"
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-6 flex flex-col items-center justify-center text-center gap-2 text-xs text-neutral-500">
            <p>Kilimani Business Hub, Nairobi</p>
            <p>+254 116 000 100</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  return <NavbarContent key={pathname} pathname={pathname} />;
}
