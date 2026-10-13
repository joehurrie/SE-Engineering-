"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-900 py-24 md:py-32 border-t border-white/10 text-white flex flex-col items-center justify-center">
      <div className="w-full px-6 sm:px-8 md:px-12 lg:px-16 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-12 mb-20 w-full max-w-7xl mx-auto text-center">
          {/* Col 1: Brand */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white font-bold text-xs rounded-none">
                SE
              </div>
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
              className="inline-flex items-center justify-center gap-3 w-full max-w-xs h-14 bg-neutral-800 hover:bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider px-6 transition-colors rounded-none mx-auto"
            >
              <span>Request Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar (Centered across 100% width) */}
        <div className="w-full max-w-7xl mx-auto border-t border-neutral-800 pt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-xs text-neutral-500 font-light text-center">
          <div>
            © {new Date().getFullYear()} Specialized Engineering Kenya Ltd. All rights reserved.
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
