"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomeContactForm() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("sending");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value || null,
      subject: "WEBSITE HOME INQUIRY",
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Inquiry submission failed");
      setFormStatus("success");
      form.reset();
      setTimeout(() => setFormStatus("idle"), 4000);
    } catch {
      setFormStatus("error");
      setTimeout(() => setFormStatus("idle"), 5000);
    }
  };

  return (
    <>
      {formStatus === "success" && (
        <div role="status" className="mb-6 flex items-center gap-3 border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>Inquiry received. Our team will respond within one business day.</span>
        </div>
      )}
      {formStatus === "error" && (
        <div role="alert" className="mb-6 flex items-center gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>We could not send your inquiry. Please try again or contact our team directly.</span>
        </div>
      )}

      <form onSubmit={handleContactSubmit} className="w-full space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="home-name" className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
              Full Name *
            </label>
            <input
              type="text"
              id="home-name"
              name="name"
              required
              placeholder="Eng. John Kamau"
              className="h-11 w-full rounded-none border border-[#E5E5E5] bg-white px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="home-email" className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
              Email Address *
            </label>
            <input
              type="email"
              id="home-email"
              name="email"
              required
              placeholder="john@development.co.ke"
              className="h-11 w-full rounded-none border border-[#E5E5E5] bg-white px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="home-phone" className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
            Phone Number
          </label>
          <input
            type="tel"
            id="home-phone"
            name="phone"
            placeholder="+254 700 000 000"
            className="h-11 w-full rounded-none border border-[#E5E5E5] bg-white px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="home-message" className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-600">
            Project Details *
          </label>
          <textarea
            id="home-message"
            name="message"
            required
            rows={4}
            placeholder="Building shaft dimensions, number of floors, or elevator type..."
            className="w-full resize-y rounded-none border border-[#E5E5E5] bg-white p-3.5 text-sm leading-relaxed text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={formStatus === "sending"}
            className={`inline-flex h-11 w-auto cursor-pointer items-center justify-center gap-2.5 px-7 rounded-none border text-xs font-semibold uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              formStatus === "success"
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-[#0F0F0F] bg-[#0F0F0F] text-white hover:border-[#2563EB] hover:bg-[#2563EB]"
            }`}
          >
            <span>{formStatus === "sending" ? "Submitting..." : formStatus === "success" ? "Request received" : "Get in touch"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </>
  );
}
