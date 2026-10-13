"use client";

import { useState } from "react";
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

const darkInputClass =
  "w-full bg-[#111111] border border-white/15 rounded-none px-4 py-3.5 text-sm text-white focus:outline-none focus:border-blue-600 transition-colors placeholder:text-neutral-500";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">

      {/* ── 1. Hero: 50vh View Height (Centered) ───────────── */}
      <section className="min-h-screen pt-32 pb-16 overflow-hidden border-b border-white/10 flex items-center justify-center bg-[#0a0a0a] relative">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600"
            alt="Nairobi High-Rise Architecture"
            className="w-full h-full object-cover brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            DIRECT COMMUNICATIONS
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-2 text-center">
            LET&rsquo;S BUILD TOGETHER.
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-4" />
          <p className="text-neutral-400 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed text-center">
            Have an upcoming architectural project, residential villa, or modernization requirement?
            Reach out to our engineering specialists in Kilimani for a free consultation.
          </p>
        </div>
      </section>

      {/* ── 2. Contact Section: Generous Spacing & Sharp Cards ─ */}
      <section className="min-h-[50vh] md:min-h-[60vh] py-24 md:py-32 bg-[#111111] border-t border-white/5 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">

          {/* Centered Section Header */}
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="inline-block px-3 py-1 bg-[#161616] border border-white/10 text-neutral-400 text-[10px] font-bold uppercase tracking-widest font-mono">
              Kilimani Headquarters
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-white text-center">
              Consult Our Engineering Team
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
            <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed text-center max-w-2xl mx-auto">
              Stationed at our Kilimani headquarters in Nairobi. We answer all architectural
              tenders and service inquiries within 24 hours on business days.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">

            {/* Left — Consultation info & Spacious Contact Cards (5 cols) */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              {/* Spacious, comfortable contact cards with sharp corners */}
              <div className="divide-y divide-white/10 border-y border-white/10">
                {contacts.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 py-4"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 text-neutral-300">
                      <c.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 space-y-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                        {c.label}
                      </p>
                      <a
                        href={c.href}
                        className="block break-words text-sm font-medium text-white transition-colors hover:text-blue-400 md:text-base"
                      >
                        {c.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust badge */}
              <div className="border-l-2 border-blue-600 pl-4">
                <p className="text-sm leading-relaxed text-neutral-300">
                  <span className="font-medium text-white">Project response:</span> inquiries are routed to our Kilimani engineering team within one business day.
                </p>
              </div>
            </div>

            {/* Right — Form Card (7 cols) with generous breathing room */}
            <div className="lg:col-span-7 space-y-8 border border-white/10 bg-[#161616] p-6 sm:p-8 md:p-10">
              <div className="space-y-2 border-b border-white/10 pb-6">
                <span className="text-xs font-mono tracking-widest text-blue-400 uppercase block font-semibold">
                  Inquiry Portal
                </span>
                <h3 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-tight">
                  Send an Inquiry
                </h3>
                <p className="text-base text-neutral-400 font-light pt-1">
                  Direct integration with our technical dispatch database in Kilimani
                </p>
              </div>

              {status === "success" && (
                <div className="p-5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm md:text-base flex items-center gap-4">
                  <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
                  <span>Thank you! Your inquiry has been received. Our team will contact you shortly.</span>
                </div>
              )}

              {status === "error" && (
                <div className="p-5 bg-red-950/60 border border-red-500/40 text-red-300 text-sm md:text-base flex items-center gap-4">
                  <AlertCircle className="w-6 h-6 shrink-0 text-red-400" />
                  <span>An error occurred. Please try calling us directly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-wider text-neutral-400 font-semibold font-mono block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={darkInputClass}
                      placeholder="Eng. John Kamau"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-wider text-neutral-400 font-semibold font-mono block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={darkInputClass}
                      placeholder="john@development.co.ke"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs uppercase tracking-wider text-neutral-400 font-semibold font-mono block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={darkInputClass}
                    placeholder="+254 700 000 000"
                  />
                </div>

                {/* Service Category Pills */}
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold font-mono flex items-center justify-between">
                    <span>Service Category</span>
                    {form.subject && <span className="text-blue-400 normal-case font-sans text-xs">Selected: {form.subject}</span>}
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {serviceCategories.map((cat) => {
                      const isSelected = form.subject === cat;
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setForm({ ...form, subject: cat })}
                          className={`text-xs px-4 py-2.5 rounded-none transition-colors border ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white font-medium shadow-md"
                              : "bg-[#111111] border-white/10 text-neutral-300 hover:text-white hover:border-white/30"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-wider text-neutral-400 font-semibold font-mono block">
                    Project Details / Tender Specifications *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${darkInputClass} resize-none`}
                    placeholder="Describe your building project: floors, elevator capacity, timeline, shaft dimensions..."
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  disabled={status === "sending" || status === "success"}
                  className={`w-full font-bold h-16 sm:h-18 rounded-none uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-3 mt-6 ${
                    status === "success"
                      ? "bg-emerald-600 text-white cursor-default"
                      : status === "sending"
                      ? "bg-neutral-700 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {status === "success" ? (
                    <><span>Message Submitted</span><CheckCircle2 className="w-5 h-5" /></>
                  ) : status === "sending" ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Submitting...</span></>
                  ) : (
                    <><span>Submit Inquiry</span><ArrowRight className="w-5 h-5" /></>
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
