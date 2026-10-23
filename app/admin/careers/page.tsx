"use client";

import { useCallback, useEffect, useState } from "react";
import { BriefcaseBusiness, Loader2, Pencil, Plus, Trash2 } from "lucide-react";

type Vacancy = {
  id: number;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string;
  published: boolean;
  createdAt: string;
};

type Application = {
  id: number;
  vacancyTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  portfolioUrl: string | null;
  message: string;
  status: string;
  createdAt: string;
};

type VacancyForm = Omit<Vacancy, "id" | "createdAt">;
const emptyForm: VacancyForm = {
  title: "",
  department: "",
  location: "",
  employmentType: "",
  description: "",
  requirements: "",
  published: false,
};

export default function AdminCareersPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [form, setForm] = useState<VacancyForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadCareers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/careers");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load careers.");
      setVacancies(data.vacancies);
      setApplications(data.applications);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load careers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/careers")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load careers.");
        return data;
      })
      .then((data) => {
        if (!active) return;
        setVacancies(data.vacancies);
        setApplications(data.applications);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Failed to load careers.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function startEdit(vacancy: Vacancy) {
    setEditingId(vacancy.id);
    setForm({
      title: vacancy.title,
      department: vacancy.department,
      location: vacancy.location,
      employmentType: vacancy.employmentType,
      description: vacancy.description,
      requirements: vacancy.requirements,
      published: vacancy.published,
    });
    setNotice(null);
  }

  function clearForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveVacancy(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(
        editingId ? `/api/admin/careers/${editingId}` : "/api/admin/careers",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save vacancy.");
      clearForm();
      setNotice(editingId ? "Vacancy updated." : "Vacancy created.");
      await loadCareers();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save vacancy.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteVacancy(vacancy: Vacancy) {
    if (!window.confirm(`Delete "${vacancy.title}"? Existing applications will remain in the inbox.`)) return;
    setError(null);
    try {
      const response = await fetch(`/api/admin/careers/${vacancy.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete vacancy.");
      setNotice("Vacancy deleted.");
      await loadCareers();
      if (editingId === vacancy.id) clearForm();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete vacancy.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 p-6 md:p-8">
      <header className="border-b border-[#E2E8F0] pb-6">
        <div className="mb-2 inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563EB]">
          <BriefcaseBusiness className="h-3.5 w-3.5" /> Recruitment
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] md:text-3xl">Careers &amp; applications</h1>
        <p className="mt-2 text-sm text-[#475569]">Create and publish opportunities, then review applications submitted through the About page.</p>
      </header>

      {error && <p role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="border border-green-200 bg-green-50 p-4 text-sm text-green-800">{notice}</p>}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-sm text-[#64748B]">
          <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" /> Loading careers records…
        </div>
      ) : (
        <>
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <form onSubmit={saveVacancy} className="space-y-5 border border-[#E2E8F0] bg-white p-5 md:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                <h2 className="text-lg font-semibold text-[#0F172A]">{editingId ? "Edit vacancy" : "Add a vacancy"}</h2>
                {editingId && <button type="button" onClick={clearForm} className="text-xs font-semibold text-[#2563EB]">Cancel edit</button>}
              </div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                Job title
                <input required maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-2 min-h-11 w-full border border-[#CBD5E1] px-3 text-sm font-normal normal-case tracking-normal text-[#0F172A] outline-none focus:border-[#2563EB]" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                  Department
                  <input required maxLength={120} placeholder="Engineering" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="mt-2 min-h-11 w-full border border-[#CBD5E1] px-3 text-sm font-normal normal-case tracking-normal text-[#0F172A] outline-none focus:border-[#2563EB]" />
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                  Location
                  <input required maxLength={160} value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="mt-2 min-h-11 w-full border border-[#CBD5E1] px-3 text-sm font-normal normal-case tracking-normal text-[#0F172A] outline-none focus:border-[#2563EB]" />
                </label>
              </div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                Employment type
                <input required maxLength={100} placeholder="Full-time" value={form.employmentType} onChange={(event) => setForm({ ...form, employmentType: event.target.value })} className="mt-2 min-h-11 w-full border border-[#CBD5E1] px-3 text-sm font-normal normal-case tracking-normal text-[#0F172A] outline-none focus:border-[#2563EB]" />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                Role description
                <textarea required maxLength={5000} rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 w-full border border-[#CBD5E1] px-3 py-2.5 text-sm font-normal normal-case leading-6 tracking-normal text-[#0F172A] outline-none focus:border-[#2563EB]" />
              </label>
              <label className="block text-xs font-semibold uppercase tracking-wide text-[#475569]">
                Requirements
                <textarea required maxLength={5000} rows={4} value={form.requirements} onChange={(event) => setForm({ ...form, requirements: event.target.value })} className="mt-2 w-full border border-[#CBD5E1] px-3 py-2.5 text-sm font-normal normal-case leading-6 tracking-normal text-[#0F172A] outline-none focus:border-[#2563EB]" />
              </label>
              <label className="flex items-center gap-3 text-sm text-[#334155]">
                <input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} className="accent-[#2563EB]" />
                Active — accept applications on the About page
              </label>
              <button disabled={saving} type="submit" className="inline-flex min-h-11 items-center gap-2 bg-[#2563EB] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {saving ? "Saving…" : editingId ? "Save changes" : "Create vacancy"}
              </button>
            </form>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <h2 className="text-lg font-semibold text-[#0F172A]">Opportunities</h2>
                <span className="text-xs text-[#64748B]">{vacancies.filter((vacancy) => vacancy.published).length} active</span>
              </div>
              {vacancies.length ? vacancies.map((vacancy) => (
                <article key={vacancy.id} className="flex flex-col justify-between gap-4 border border-[#E2E8F0] bg-white p-5 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">{vacancy.title}</h3>
                    <p className="mt-1 text-xs text-[#64748B]">{vacancy.department} · {vacancy.location} · {vacancy.employmentType}</p>
                    <span className={`mt-3 inline-block border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${vacancy.published ? "border-green-200 bg-green-50 text-green-700" : "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]"}`}>
                      {vacancy.published ? "Active" : "Closed"}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => startEdit(vacancy)} aria-label={`Edit ${vacancy.title}`} className="inline-flex h-10 w-10 items-center justify-center border border-[#CBD5E1] text-[#334155] hover:border-[#2563EB] hover:text-[#2563EB]"><Pencil className="h-4 w-4" /></button>
                    <button type="button" onClick={() => void deleteVacancy(vacancy)} aria-label={`Delete ${vacancy.title}`} className="inline-flex h-10 w-10 items-center justify-center border border-[#CBD5E1] text-[#334155] hover:border-red-300 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </article>
              )) : <p className="border border-[#E2E8F0] bg-white p-8 text-center text-sm text-[#64748B]">No vacancies have been added.</p>}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-end justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-xl font-semibold text-[#0F172A]">Applications</h2>
                <p className="mt-1 text-sm text-[#64748B]">Applicant contact details and resume links are visible only to administrators.</p>
              </div>
              <span className="text-xs text-[#64748B]">{applications.length} total</span>
            </div>
            {applications.length ? applications.map((application) => (
              <article key={application.id} className="grid gap-4 border border-[#E2E8F0] bg-white p-5 md:grid-cols-[1fr_1.4fr]">
                <div>
                  <h3 className="font-semibold text-[#0F172A]">{application.name}</h3>
                  <p className="mt-1 text-xs text-[#64748B]">{application.vacancyTitle} · {new Date(application.createdAt).toLocaleDateString()}</p>
                  <a className="mt-3 block text-sm text-[#2563EB] underline underline-offset-4" href={`mailto:${application.email}`}>{application.email}</a>
                  <a className="mt-1 block text-sm text-[#2563EB]" href={`tel:${application.phone}`}>{application.phone}</a>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-[#2563EB]">
                    <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">Resume ↗</a>
                    {application.portfolioUrl && <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer">Portfolio ↗</a>}
                  </div>
                </div>
                <p className="whitespace-pre-line border-l border-[#E2E8F0] pl-4 text-sm leading-6 text-[#475569]">{application.message}</p>
              </article>
            )) : <p className="border border-[#E2E8F0] bg-white p-8 text-center text-sm text-[#64748B]">No applications have been submitted.</p>}
          </section>
        </>
      )}
    </div>
  );
}
