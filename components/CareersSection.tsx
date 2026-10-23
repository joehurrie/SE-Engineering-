"use client";

import { useState } from "react";

export type CareerOpening = {
  id: number;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string;
};

type CareersSectionProps = {
  openings: CareerOpening[];
  unavailable?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  applyLabel?: string;
};

export default function CareersSection({
  openings,
  unavailable = false,
  eyebrow = "Careers",
  title = "Join us.",
  description = "Bring your skills to a team engineering safer, more dependable vertical transportation.",
  applyLabel = "Apply now",
}: CareersSectionProps) {
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitting(true);
    setStatus(null);

    const form = new FormData(formElement);
    const vacancyValue = String(form.get("vacancyId") || "");
    const responseData = {
      vacancyId: vacancyValue ? Number(vacancyValue) : null,
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      resumeUrl: String(form.get("resumeUrl") || ""),
      portfolioUrl: String(form.get("portfolioUrl") || ""),
      message: String(form.get("message") || ""),
      consent: form.get("consent") === "on",
      website: String(form.get("website") || ""),
    };

    try {
      const response = await fetch("/api/careers/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseData),
      });
      const result: { error?: string; message?: string } = await response.json();
      if (!response.ok) throw new Error(result.error || "Application submission failed.");
      formElement.reset();
      setSelectedVacancy("");
      setStatus({ type: "success", message: result.message || "Application received." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Could not submit your application.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="join-us" className="scroll-mt-28 border-t border-neutral-200 bg-[#F7F8FA] px-6 py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col justify-between gap-8 bg-neutral-950 px-6 py-9 text-white sm:px-10 md:flex-row md:items-center md:px-12 md:py-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">{eyebrow}</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-neutral-300 md:text-base">
              {description}
            </p>
          </div>
          {openings.length > 0 && (
            <button
              type="button"
              aria-expanded={applicationOpen}
              aria-controls="career-application"
              onClick={() => {
                setSelectedVacancy("");
                setApplicationOpen((open) => !open);
              }}
              className="inline-flex min-h-12 shrink-0 items-center justify-center border border-white/50 px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-[#2563EB] hover:bg-[#2563EB]"
            >
              {applicationOpen ? "Hide application" : applyLabel}
            </button>
          )}
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">Open opportunities</h3>
            <div className="mt-5 border-t border-neutral-300">
              {openings.length ? openings.map((opening) => (
                <article key={opening.id} className="border-b border-neutral-300 py-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h4 className="text-xl font-semibold text-neutral-950">{opening.title}</h4>
                    <span className="text-xs font-medium uppercase tracking-wide text-[#2563EB]">{opening.department} · {opening.employmentType}</span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-wide text-neutral-500">{opening.location}</p>
                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-neutral-600">{opening.description}</p>
                  <h5 className="mt-4 text-xs font-semibold uppercase tracking-wide text-neutral-800">What we’re looking for</h5>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-600">{opening.requirements}</p>
                  <button
                    type="button"
                    aria-expanded={applicationOpen && selectedVacancy === String(opening.id)}
                    aria-controls="career-application"
                    onClick={() => {
                      setSelectedVacancy(String(opening.id));
                      setApplicationOpen(true);
                    }}
                    className="mt-4 inline-flex min-h-10 items-center gap-2 border-b border-[#2563EB] text-xs font-semibold uppercase tracking-wide text-[#2563EB]"
                  >
                    Apply for this role <span aria-hidden="true">→</span>
                  </button>
                </article>
              )) : (
                <div className="border-b border-neutral-300 py-6">
                  <h4 className="text-lg font-medium text-neutral-900">
                    {unavailable ? "Opportunities are temporarily unavailable" : "No current vacancies"}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {unavailable
                      ? "Please check back later for current openings."
                      : "There are no open roles at the moment. Please check back for future opportunities."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {openings.length > 0 && applicationOpen ? (
            <div id="career-application" className="border border-neutral-200 bg-white p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-950">Send an application</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Share your contact details and secure links to your resume and portfolio.
                  </p>
                </div>
                <button type="button" onClick={() => setApplicationOpen(false)} className="shrink-0 text-xs font-semibold uppercase tracking-wide text-neutral-500 hover:text-[#2563EB]">
                  Close
                </button>
              </div>
              <form onSubmit={submitApplication} className="mt-7 space-y-5">
                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="career-website">Leave this field empty</label>
                  <input id="career-website" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <div>
                  <label htmlFor="career-vacancy" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-700">Opportunity</label>
                  <select
                    id="career-vacancy"
                    name="vacancyId"
                    value={selectedVacancy}
                    onChange={(event) => setSelectedVacancy(event.target.value)}
                    className="min-h-12 w-full border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-[#2563EB]"
                  >
                    <option value="">General application</option>
                    {openings.map((opening) => <option key={opening.id} value={opening.id}>{opening.title}</option>)}
                  </select>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-700">
                    Full name
                    <input id="career-application-name" name="name" required maxLength={120} autoComplete="name" className="mt-2 min-h-12 w-full border border-neutral-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-neutral-900 outline-none focus:border-[#2563EB]" />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-700">
                    Email
                    <input name="email" type="email" required maxLength={254} autoComplete="email" className="mt-2 min-h-12 w-full border border-neutral-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-neutral-900 outline-none focus:border-[#2563EB]" />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-700">
                    Phone
                    <input name="phone" type="tel" required maxLength={40} autoComplete="tel" className="mt-2 min-h-12 w-full border border-neutral-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-neutral-900 outline-none focus:border-[#2563EB]" />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-700">
                    Resume link (HTTPS)
                    <input name="resumeUrl" type="url" required maxLength={2048} placeholder="https://" className="mt-2 min-h-12 w-full border border-neutral-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-neutral-900 outline-none focus:border-[#2563EB]" />
                  </label>
                </div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-700">
                  Portfolio link <span className="font-normal normal-case tracking-normal text-neutral-500">(optional, HTTPS)</span>
                  <input name="portfolioUrl" type="url" maxLength={2048} placeholder="https://" className="mt-2 min-h-12 w-full border border-neutral-300 bg-white px-3 text-sm font-normal normal-case tracking-normal text-neutral-900 outline-none focus:border-[#2563EB]" />
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-700">
                  Message
                  <textarea name="message" required maxLength={3000} rows={5} className="mt-2 w-full border border-neutral-300 bg-white px-3 py-3 text-sm font-normal normal-case leading-6 tracking-normal text-neutral-900 outline-none focus:border-[#2563EB]" />
                </label>
                <label className="flex items-start gap-3 text-sm leading-6 text-neutral-600">
                  <input name="consent" type="checkbox" required className="mt-1 accent-[#2563EB]" />
                  <span>I consent to Specialized Engineering Kenya Ltd. storing and reviewing my application for recruitment purposes. See our <a href="/privacy" className="underline underline-offset-4">Privacy Policy</a>.</span>
                </label>
                {status && (
                  <p role={status.type === "error" ? "alert" : "status"} className={`border p-3 text-sm ${status.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-800"}`}>
                    {status.message}
                  </p>
                )}
                <button type="submit" disabled={submitting} className="inline-flex min-h-12 items-center justify-center bg-neutral-950 px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#2563EB] disabled:cursor-wait disabled:opacity-60">
                  {submitting ? "Submitting…" : "Send application"}
                </button>
              </form>
            </div>
          ) : (
            <aside className="flex min-h-48 flex-col justify-center border-y border-neutral-300 py-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2563EB]">
                {openings.length > 0
                  ? "Ready when you are"
                  : unavailable
                    ? "Recruitment availability"
                    : "Applications currently closed"}
              </p>
              <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-600">
                {openings.length > 0
                  ? "Choose an open role or use Apply now to begin. Your application form will appear here."
                  : unavailable
                    ? "Vacancy information is temporarily unavailable."
                    : "Application forms are available when a vacancy is posted."}
              </p>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
