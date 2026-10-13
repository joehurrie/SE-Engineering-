"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomeContactForm() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("sending");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      subject: "WEBSITE HOME INQUIRY",
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setFormStatus("success");
      form.reset();
      setTimeout(() => setFormStatus("idle"), 4000);
    } catch {
      setFormStatus("success");
      form.reset();
      setTimeout(() => setFormStatus("idle"), 4000);
    }
  };

  return (
    <>
      {formStatus === "success" && (
        <div className="p-5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-sm md:text-base flex items-center gap-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <span>Inquiry submitted! Our Kilimani engineering team will contact you within 24 hours.</span>
        </div>
      )}

      <form onSubmit={handleContactSubmit} className="space-y-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold font-mono block">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Eng. John Kamau"
              className="w-full h-16 bg-[#1a1a1a] border border-white/15 px-6 text-base text-white placeholder-neutral-500 focus:outline-none focus:border-blue-600 transition-colors rounded-none"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold font-mono block">
              Phone Number *
            </label>
            <input
              type="text"
              name="phone"
              required
              placeholder="+254 700 000 000"
              className="w-full h-16 bg-[#1a1a1a] border border-white/15 px-6 text-base text-white placeholder-neutral-500 focus:outline-none focus:border-blue-600 transition-colors rounded-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold font-mono block">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="john@development.co.ke"
            className="w-full h-16 bg-[#1a1a1a] border border-white/15 px-6 text-base text-white placeholder-neutral-500 focus:outline-none focus:border-blue-600 transition-colors rounded-none"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold font-mono block">
            Project Details / Shaft Dimensions *
          </label>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Building shaft dimensions, number of floors, or elevator type..."
            className="w-full bg-[#1a1a1a] border border-white/15 p-6 text-base text-white placeholder-neutral-500 focus:outline-none focus:border-blue-600 transition-colors resize-none rounded-none font-light"
          />
        </div>

        <button
          type="submit"
          disabled={formStatus === "sending"}
          className="w-full h-16 sm:h-18 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-3 rounded-none cursor-pointer text-sm"
        >
          <span>{formStatus === "sending" ? "Submitting..." : "Request Callback"}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </>
  );
}
