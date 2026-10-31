"use client";

import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { defaultFooterSettings, FooterSettingsData } from "@/lib/footer-content";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.55 0 8.25 3.7 8.25 8.24 0 2.2-.86 4.28-2.42 5.83a8.196 8.196 0 0 1-5.83 2.41c-1.47 0-2.93-.39-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.38c0-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.35.06-.53.25-.53.53-.98 1.29-.98 2.25 0 1.29.83 2.65 1.95 3.96 1.13 1.32 2.65 2.37 4.1 2.87.52.18 1.05.28 1.58.28.98 0 1.77-.38 2.22-.92.23-.27.38-.59.42-.76.04-.17.02-.32-.06-.41-.09-.09-.98-.48-1.55-.76-.23-.11-.41-.12-.57.12-.17.26-.65.81-.8 1-.15.19-.3.21-.56.08-.26-.13-1.09-.4-2.07-1.28-.77-.68-1.29-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.51-.41-.44-.56-.45z" />
    </svg>
  );
}

function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case "Facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
          <path d="M13.4 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.6 1.6-1.6h1.7V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5V13h2.7v8h3.2Z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.7" cy="6.6" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "YouTube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
          <path d="M23 7.1a3 3 0 0 0-2.1-2.2C19 4.4 12 4.4 12 4.4s-7 0-8.9.5A3 3 0 0 0 1 7.1 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.2c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.2 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM9.8 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
          <path d="M18.2 5.2a4.5 4.5 0 0 1-2.8-3.7h-3.5v14.1a2.8 2.8 0 1 1-2.8-2.8c.4 0 .8.1 1.1.2V9.4a6.5 6.5 0 1 0 5.2 6.3V8.5a8 8 0 0 0 4.6 1.4V6.4c-.6 0-1.2-.1-1.8-.3Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="currentColor">
          <path d="M4.5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 9h3v12H3zm5 0h2.9v1.6h.1A3.2 3.2 0 0 1 14 8.8c3.1 0 3.7 2 3.7 4.6V21h-3v-6.7c0-1.6 0-3-1.9-3s-2.2 1.5-2.2 2.9V21H8z" />
        </svg>
      );
  }
}

export default function Footer({ data }: { data?: FooterSettingsData }) {
  const footer = data || defaultFooterSettings;

  const phoneTel = footer.contact.phonePrimary.replace(/[^\d+]/g, "");
  const rawWhatsapp = footer.contact.whatsappNumber || footer.contact.phoneSecondary || "+254713104907";
  const whatsappDigits = rawWhatsapp.replace(/[^\d]/g, "");
  const whatsappMessage = encodeURIComponent("Hello Specialized Engineering, I would like to inquire about elevator solutions.");
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${whatsappMessage}`;

  const socialList = [
    { label: "Facebook", href: footer.socials.facebook },
    { label: "Instagram", href: footer.socials.instagram },
    { label: "YouTube", href: footer.socials.youtube },
    { label: "TikTok", href: footer.socials.tiktok },
    { label: "LinkedIn", href: footer.socials.linkedin },
  ].filter((item) => item.href && item.href.trim() !== "");

  return (
    <footer className="w-full bg-neutral-900 py-24 md:py-32 border-t border-white/10 text-white flex flex-col items-center justify-center font-sans">
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
              <div className="flex flex-col text-left">
                <span className="text-white font-bold tracking-tight text-base uppercase leading-none">
                  SPECIALIZED
                </span>
                <span className="text-[10px] tracking-widest uppercase font-medium text-white/70 mt-1">
                  Engineering Kenya
                </span>
              </div>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8 font-light max-w-xs mx-auto">
              {footer.tagline}
            </p>
            <div className="flex justify-center gap-4">
              {footer.contact.phonePrimary && (
                <a
                  href={`tel:${phoneTel}`}
                  className="w-11 h-11 bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-[#2563EB] hover:text-white transition-colors rounded-none"
                  aria-label="Call Specialized Engineering"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
              {footer.contact.emailPrimary && (
                <a
                  href={`mailto:${footer.contact.emailPrimary}`}
                  className="w-11 h-11 bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-[#2563EB] hover:text-white transition-colors rounded-none"
                  aria-label="Email Specialized Engineering"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
              <Link
                href="/contact"
                className="w-11 h-11 bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-[#2563EB] hover:text-white transition-colors rounded-none"
                aria-label="Visit Specialized Engineering"
              >
                <MapPin className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Col 2: Elevator Products / Quick Links */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider text-center">
              {footer.quickLinksTitle}
            </h4>
            <ul className="space-y-3.5 flex flex-col items-center text-center">
              {footer.quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white text-sm transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Details & Operating Hours */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider text-center">
              Contact Us
            </h4>
            <ul className="space-y-5 flex flex-col items-center text-center">
              <li className="flex flex-col items-center text-center gap-2 text-neutral-400 text-sm font-light">
                <MapPin className="w-5 h-5 text-[#2563EB] shrink-0" />
                <span>{footer.contact.officeAddress}</span>
              </li>
              <li className="flex flex-col items-center text-center gap-1.5 text-neutral-400 text-sm font-light">
                <Phone className="w-5 h-5 text-[#2563EB] shrink-0" />
                <a
                  href={`tel:${phoneTel}`}
                  className="hover:text-white transition-colors"
                >
                  {footer.contact.phonePrimary}
                </a>
                {footer.contact.phoneSecondary && (
                  <span className="text-xs text-neutral-500 font-normal">
                    Alt: {footer.contact.phoneSecondary}
                  </span>
                )}
              </li>
              <li className="flex flex-col items-center text-center gap-1.5 text-neutral-400 text-sm font-light">
                <Mail className="w-5 h-5 text-[#2563EB] shrink-0" />
                <a
                  href={`mailto:${footer.contact.emailPrimary}`}
                  className="truncate hover:text-white transition-colors"
                >
                  {footer.contact.emailPrimary}
                </a>
                {footer.contact.emailSupport && (
                  <a
                    href={`mailto:${footer.contact.emailSupport}`}
                    className="text-xs text-neutral-500 truncate hover:text-white transition-colors"
                  >
                    Support: {footer.contact.emailSupport}
                  </a>
                )}
              </li>

            </ul>
          </div>

          {/* Col 4: Dispatch Request / Consultation */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-wider text-center">
              Get In Touch
            </h4>
            <p className="text-neutral-400 text-sm mb-8 font-light leading-relaxed max-w-xs mx-auto text-center">
              {footer.consultationText}
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
              <Link
                href={footer.consultationButtonHref}
                className="inline-flex items-center justify-center gap-3 w-full h-12 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold uppercase tracking-wider px-6 transition-colors rounded-none shadow-md"
              >
                <span>{footer.consultationButtonLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white text-xs font-semibold uppercase tracking-wider px-6 transition-all duration-200 rounded-none shadow-md hover:shadow-lg"
                aria-label="Chat on WhatsApp with Specialized Engineering"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Centered across 100% width) */}
        <div className="w-full max-w-7xl mx-auto border-t border-neutral-800 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400 font-light text-center">
          <div>
            © {new Date().getFullYear()} {footer.copyrightText}
          </div>
          <div className="flex items-center gap-2" aria-label="Social media">
            {socialList.map(({ label, href }) => (
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
