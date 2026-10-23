"use client";

import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case "Facebook":
      return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor"><path d="M13.4 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5V13h2.7v8h3.2Z" /></svg>;
    case "Instagram":
      return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><circle cx="12" cy="12" r="4" /><circle cx="17.7" cy="6.6" r="1" fill="currentColor" stroke="none" /></svg>;
    case "YouTube":
      return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor"><path d="M23 7.1a3 3 0 0 0-2.1-2.2C19 4.4 12 4.4 12 4.4s-7 0-8.9.5A3 3 0 0 0 1 7.1 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.2c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.2 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM9.8 15.5v-7l6 3.5-6 3.5Z" /></svg>;
    case "TikTok":
      return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor"><path d="M18.2 5.2a4.5 4.5 0 0 1-2.8-3.7h-3.5v14.1a2.8 2.8 0 1 1-2.8-2.8c.4 0 .8.1 1.1.2V9.4a6.5 6.5 0 1 0 5.2 6.3V8.5a8 8 0 0 0 4.6 1.4V6.4c-.6 0-1.2-.1-1.8-.3Z" /></svg>;
    default:
      return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor"><path d="M4.5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 9h3v12H3zm5 0h2.9v1.6h.1A3.2 3.2 0 0 1 14 8.8c3.1 0 3.7 2 3.7 4.6V21h-3v-6.7c0-1.6 0-3-1.9-3s-2.2 1.5-2.2 2.9V21H8z" /></svg>;
  }
}

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-900 py-24 md:py-32 border-t border-white/10 text-white flex flex-col items-center justify-center">
      <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-12 mb-20 w-full max-w-7xl mx-auto text-center">
          {/* Col 1: Brand */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img
                src="/se-logo.jpeg"
                alt="Specialized Engineering Kenya Ltd."
                width={40}
                height={40}
                className="object-contain rounded-none"
                style={{ display: "block" }}
              />
              <span className="text-white font-bold tracking-tight text-base">
                SPECIALIZED
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8 font-light max-w-xs mx-auto">
              Precision vertical engineering &amp; elevator manufacturing. Exclusive XIZI partner delivering ISO-certified installations across East Africa.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="tel:+254116000100"
                className="w-11 h-11 bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="Call Specialized Engineering"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:specializedengineeringltd@gmail.com"
                className="w-11 h-11 bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="Email Specialized Engineering"
              >
                <Mail className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                className="w-11 h-11 bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="Visit Specialized Engineering"
              >
                <MapPin className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Col 2: Elevator Products */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider text-center">
              Elevator Systems
            </h4>
            <ul className="space-y-3.5 flex flex-col items-center text-center">
              <li>
                <Link href="/elevators/passenger-elevator" className="text-neutral-400 hover:text-white text-sm transition-colors font-light">
                  Passenger Elevators
                </Link>
              </li>
              <li>
                <Link href="/elevators/home-lift" className="text-neutral-400 hover:text-white text-sm transition-colors font-light">
                  Home &amp; Villa Lifts
                </Link>
              </li>
              <li>
                <Link href="/elevators/panoramic-elevator" className="text-neutral-400 hover:text-white text-sm transition-colors font-light">
                  Panoramic Glass Lifts
                </Link>
              </li>
              <li>
                <Link href="/elevators/escalator-moving-walk" className="text-neutral-400 hover:text-white text-sm transition-colors font-light">
                  Escalators &amp; Moving Walks
                </Link>
              </li>
              <li>
                <Link href="/elevators/hospital-elevator" className="text-neutral-400 hover:text-white text-sm transition-colors font-light">
                  Hospital Bed Elevators
                </Link>
              </li>
              <li>
                <Link href="/elevators/freight-car-elevator" className="text-neutral-400 hover:text-white text-sm transition-colors font-light">
                  Freight &amp; Car Lifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider text-center">
              Contact Us
            </h4>
            <ul className="space-y-5 flex flex-col items-center text-center">
              <li className="flex flex-col items-center text-center gap-2 text-neutral-400 text-sm font-light">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span>
                  Kilimani Business Hub,<br />
                  Nairobi, Kenya
                </span>
              </li>
              <li className="flex flex-col items-center text-center gap-2 text-neutral-400 text-sm font-light">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+254 (0)116 000100</span>
              </li>
              <li className="flex flex-col items-center text-center gap-2 text-neutral-400 text-sm font-light">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="truncate">specializedengineeringltd@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Dispatch Request */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider text-center">
              Get In Touch
            </h4>
            <p className="text-neutral-400 text-sm mb-8 font-light leading-relaxed max-w-xs mx-auto text-center">
              Connect with our Nairobi engineering team for certified shaft planning and tenders.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 w-full max-w-xs h-14 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold uppercase tracking-wider px-6 transition-colors rounded-none mx-auto shadow-md"
            >
              <span>Request Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar (Centered across 100% width) */}
        <div className="w-full max-w-7xl mx-auto border-t border-neutral-800 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400 font-light text-center">
          <div>
            © {new Date().getFullYear()} Specialized Engineering Kenya Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-2" aria-label="Social media">
            {socialLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-8 w-8 items-center justify-center rounded-none border border-neutral-800 bg-neutral-800/80 text-neutral-300 transition-colors hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white"
              >
                <SocialIcon label={label} />
              </a>
            ))}
          </div>
          <div className="flex gap-8 justify-center">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
