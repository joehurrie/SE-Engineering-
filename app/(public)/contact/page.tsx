"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Phone, Mail, MapPin, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const contacts = [
  { icon: Phone,  label: "Managing Director (Alan)",  value: "+254 (0)116 000100",                   href: "tel:+254116000100" },
  { icon: Phone,  label: "Operations Director (Ana)",  value: "+254 (0)713 104907",                   href: "tel:+254713104907" },
  { icon: Mail,   label: "Official Correspondence",    value: "specializedengineeringltd@gmail.com",   href: "mailto:specializedengineeringltd@gmail.com" },
  { icon: MapPin, label: "Office & Technical Hub",     value: "Kilimani Business Hub, Nairobi, Kenya", href: "#" },
  { icon: Clock,  label: "Operating Hours",            value: "Mon–Fri: 8:00 AM – 6:00 PM · Emergency: 24/7 Standby", href: "#" },
];

const serviceCategories = [
  "Home Lift",
  "Passenger Elevator",
  "Escalator & Moving Walk",
  "Panoramic Elevator",
  "Hospital Elevator",
  "Freight / Car Elevator",
  "Dumbwaiter",
  "Hydraulic Platform",
  "Spare Parts Supply",
  "Lift Modernization",
  "Solution Customization",
  "General Inquiry",
];

const inputClass =
  "w-full rounded-none border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#2563EB]";


export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [content, setContent] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    let active = true;
    fetch("/api/site-content")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Failed to load contact page content.");
        if (!Array.isArray(result.contents)) throw new Error("Invalid contact page content response.");
        const sections: Record<string, Record<string, string>> = {};
        for (const item of result.contents) {
          if (!item || typeof item.sectionKey !== "string" || typeof item.contentJson !== "string") continue;
          try {
            const parsed: unknown = JSON.parse(item.contentJson);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
              sections[item.sectionKey] = Object.fromEntries(
                Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string")
              );
            }
          } catch (error) {
            console.error(`Failed to parse contact page section "${item.sectionKey}":`, error);
          }
        }
        if (active) setContent(sections);
      })
      .catch((error: unknown) => {
        console.error("Failed to load public contact content:", error);
      });
    return () => {
      active = false;
    };
  }, []);

  const hero = content.contact_hero || {};
  const details = content.contact_details || {};
  const value = (section: Record<string, string>, key: string, fallback: string) =>
    section[key]?.trim() || fallback;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Failed to submit contact inquiry:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">

      {/* ── 1. Hero: Standardized Dimensions (100% view height on mobile, 70vh on desktop) ── */}
      <section className="relative flex min-h-[100svh] md:min-h-0 md:h-[70vh] items-center justify-center overflow-hidden border-b border-neutral-200 bg-[#F5F5F3] px-6 py-12 md:py-16 text-center">
        <div className="absolute inset-0 z-0">
          {hero.videoUrl?.trim() ? (
            <video src={hero.videoUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <img
              src={value(hero, "imageUrl", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600")}
              alt="Nairobi High-Rise Architecture"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content — high-contrast Manrope on natural image */}
        <div className="relative z-10 mx-auto max-w-4xl flex flex-col items-center justify-center">
          <div className="mb-4 inline-flex items-center gap-2 bg-[#2563EB] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
            {value(hero, "subtitle", "DIRECT COMMUNICATIONS")}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg mt-2 mb-4 text-center">
            {value(hero, "title", "LET'S BUILD TOGETHER.")}
          </h1>
          <div className="w-20 h-1 bg-[#2563EB] mx-auto mb-5" />
          <p className="text-white drop-shadow-lg text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed text-center">
            {value(hero, "bodyText", "Have an upcoming architectural project, residential villa, or modernization requirement? Reach out to our engineering specialists in Kilimani for a free consultation.")}
          </p>
        </div>
      </section>

      {/* ── 2. Contact Info + Form — pure white, editorial whitespace ─ */}
      <section id="form" className="py-24 md:py-32 bg-white border-t border-neutral-100">
        <div className="w-full max-w-7xl mx-auto px-6">

          {/* Section header — centered, minimal */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-block border border-neutral-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {value(details, "badge", "Kilimani Headquarters")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight uppercase leading-tight text-neutral-900">
              {value(details, "title", "Consult Our Engineering Team")}
            </h2>
            <div className="w-16 h-0.5 bg-[#2563EB]" />
            <p className="text-neutral-500 text-sm md:text-base font-light leading-relaxed max-w-xl">
              {value(details, "bodyText", "Stationed at our Kilimani headquarters in Nairobi. We answer all architectural tenders and service inquiries within 24 hours on business days.")}
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">

            {/* Left — minimal contact info strip */}
            <div className="lg:col-span-4 flex flex-col border-t border-neutral-100">
              {contacts.map((contact, idx) => {
                const c = {
                  ...contact,
                  label: value(details, `contact${idx + 1}Label`, contact.label),
                  value: value(details, `contact${idx + 1}Value`, contact.value),
                  href: value(details, `contact${idx + 1}Href`, contact.href),
                };
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 py-5 border-b border-neutral-100"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-neutral-200 text-neutral-400">
                      <c.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                        {c.label}
                      </p>
                      <a
                        href={c.href}
                        className="block break-words text-sm font-medium text-neutral-800 transition-colors hover:text-[#2563EB]"
                      >
                        {c.value}
                      </a>
                    </div>
                  </div>
                );
              })}

              <p className="pt-6 text-xs leading-relaxed text-neutral-400">
                <span className="font-medium text-neutral-600">Response time:</span>{" "}
                inquiries are routed to our engineering team within one business day.
              </p>
            </div>

            {/* Right — form with clean grey background for enhanced visibility */}
            <div className="lg:col-span-8 bg-[#F5F5F3] border border-neutral-200 p-6 sm:p-8 md:p-10 shadow-sm">
              {/* Form heading */}
              <div className="mb-8 border-b border-neutral-200 pb-6">
                <span className="text-[10px] tracking-widest text-[#2563EB] uppercase font-semibold block mb-2">
                  {value(details, "formBadge", "Inquiry Portal")}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 uppercase tracking-tight leading-tight">
                  {value(details, "formTitle", "Send an Inquiry")}
                </h3>
                <p className="text-sm text-neutral-400 font-light pt-2">
                  {value(details, "formDescription", "Direct integration with our technical dispatch database in Kilimani.")}
                </p>
              </div>

              {/* Status toasts — left-border accent style */}
              {status === "success" && (
                <div className="mb-6 border-l-2 border-emerald-500 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>Thank you! Your inquiry has been received. Our team will contact you shortly.</span>
                </div>
              )}
              {status === "error" && (
                <div className="mb-6 border-l-2 border-red-400 bg-red-50 px-5 py-4 text-sm text-red-700 flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>An error occurred. Please try calling us directly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">
                      Full Name <span className="text-[#2563EB]">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                      placeholder="Eng. John Kamau"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">
                      Email Address <span className="text-[#2563EB]">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                      placeholder="john@development.co.ke"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="contact-phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="+254 700 000 000"
                    pattern="[\+\d\s\-\(\)]+"
                    title="Please enter a valid phone number"
                  />
                </div>

                {/* Service category chips — refined */}
                <div className="space-y-2.5">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold flex items-center justify-between">
                    <span>Service Category</span>
                    {form.subject && (
                      <span className="text-[#2563EB] normal-case text-[10px] font-semibold">
                        ✓ {form.subject}
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:overflow-x-auto sm:pb-1 md:flex-wrap md:overflow-visible">
                    {serviceCategories.map((cat) => {
                      const isSelected = form.subject === cat;
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setForm({ ...form, subject: cat })}
                          className={`text-[11px] px-3.5 py-2 rounded-none transition-colors border font-medium ${
                            isSelected
                              ? "bg-[#2563EB] border-[#2563EB] text-white"
                              : "bg-white border-neutral-200 text-neutral-600 hover:border-[#2563EB] hover:text-[#2563EB]"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold block">
                    Project Details <span className="text-[#2563EB]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe your project: floors, elevator capacity, timeline, shaft dimensions…"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  disabled={status === "sending" || status === "success"}
                  className={`w-full font-semibold rounded-none uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-3 py-4 mt-2 ${
                    status === "success"
                      ? "bg-emerald-600 text-white cursor-default"
                      : status === "sending"
                      ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                      : "bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1D4ED8] text-white"
                  }`}
                >
                  {status === "success" ? (
                    <><span>Message Submitted</span><CheckCircle2 className="w-4 h-4" /></>
                  ) : status === "sending" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Submitting…</span></>
                  ) : (
                    <><span>{value(details, "submitLabel", "Submit Inquiry")}</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
