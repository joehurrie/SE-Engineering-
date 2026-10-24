"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Scale,
  Shield,
  Trash2,
  Clock,
  Eye,
  FileText,
  Share2,
} from "lucide-react";
import {
  defaultFooterSettings,
  defaultPrivacyPolicy,
  defaultTermsOfService,
  FooterQuickLink,
  FooterSettingsData,
  LegalPolicyData,
} from "@/lib/footer-content";

type ActiveTab = "contact" | "links" | "privacy" | "terms";

export default function AdminFooterLegalPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("contact");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [footer, setFooter] = useState<FooterSettingsData>(defaultFooterSettings);
  const [privacy, setPrivacy] = useState<LegalPolicyData>(defaultPrivacyPolicy);
  const [terms, setTerms] = useState<LegalPolicyData>(defaultTermsOfService);

  // Preview toggles
  const [showPrivacyPreview, setShowPrivacyPreview] = useState(false);
  const [showTermsPreview, setShowTermsPreview] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/footer-legal")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load footer & legal configuration");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        if (data.footer) setFooter(data.footer);
        if (data.privacy) setPrivacy(data.privacy);
        if (data.terms) setTerms(data.terms);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Error fetching settings");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (sectionToSave?: "all" | "footer" | "privacy" | "terms") => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    const payload: {
      footer?: FooterSettingsData;
      privacy?: LegalPolicyData;
      terms?: LegalPolicyData;
    } = {};

    if (!sectionToSave || sectionToSave === "all" || sectionToSave === "footer") {
      payload.footer = footer;
    }
    if (!sectionToSave || sectionToSave === "all" || sectionToSave === "privacy") {
      payload.privacy = privacy;
    }
    if (!sectionToSave || sectionToSave === "all" || sectionToSave === "terms") {
      payload.terms = terms;
    }

    try {
      const res = await fetch("/api/admin/footer-legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setSaveSuccess(true);
      window.setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Quick Links Helpers
  const addQuickLink = () => {
    setFooter((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { label: "New Link", href: "/" }],
    }));
  };

  const updateQuickLink = (index: number, field: keyof FooterQuickLink, value: string) => {
    setFooter((prev) => {
      const updated = [...prev.quickLinks];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, quickLinks: updated };
    });
  };

  const removeQuickLink = (index: number) => {
    setFooter((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-12 text-[#64748B]">
        <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
        <span className="text-xs uppercase tracking-wider font-semibold">Loading Footer &amp; Legal Configuration…</span>
      </div>
    );
  }

  const inputClass =
    "w-full border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] outline-none transition rounded-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-6 md:p-8 font-sans">
      {/* Header */}
      <header className="border-b border-[#E2E8F0] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563EB] rounded-none">
            <Scale className="h-3.5 w-3.5" />
            Global Footer &amp; Legal Compliance
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] md:text-3xl">
            Footer &amp; Legal Settings
          </h1>
          <p className="mt-1 text-sm text-[#475569]">
            Manage global contact information, operating hours, quick links, social media URLs, and editable full-text legal policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/privacy"
            target="_blank"
            className="inline-flex items-center gap-1.5 border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition rounded-none"
          >
            <span>Preview Privacy</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            href="/terms"
            target="_blank"
            className="inline-flex items-center gap-1.5 border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition rounded-none"
          >
            <span>Preview Terms</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={() => handleSave("all")}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#2563EB] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:opacity-50 rounded-none"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="h-4 w-4 text-white" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? "Saving…" : saveSuccess ? "Saved Successfully" : "Save All Changes"}</span>
          </button>
        </div>
      </header>

      {/* Notifications */}
      {error && (
        <div role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-700 rounded-none">
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 rounded-none">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>All footer configuration and legal policies have been saved and public pages revalidated.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-[#E2E8F0] flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition rounded-none border-b-2 ${
            activeTab === "contact"
              ? "border-[#2563EB] bg-blue-50/60 text-[#2563EB]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
          }`}
        >
          <Phone className="h-4 w-4" />
          <span>Contact &amp; Operations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("links")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition rounded-none border-b-2 ${
            activeTab === "links"
              ? "border-[#2563EB] bg-blue-50/60 text-[#2563EB]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>Links &amp; Social Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("privacy")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition rounded-none border-b-2 ${
            activeTab === "privacy"
              ? "border-[#2563EB] bg-blue-50/60 text-[#2563EB]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Privacy Policy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("terms")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider transition rounded-none border-b-2 ${
            activeTab === "terms"
              ? "border-[#2563EB] bg-blue-50/60 text-[#2563EB]"
              : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Terms &amp; Conditions</span>
        </button>
      </div>

      {/* TAB 1: CONTACT INFORMATION & OPERATING HOURS */}
      {activeTab === "contact" && (
        <div className="space-y-6">
          <div className="border border-[#E2E8F0] bg-white p-6 md:p-8 rounded-none">
            <div className="mb-6 border-b border-[#E2E8F0] pb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#0F172A]">
                Company Contact &amp; Operating Hours
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                These contact numbers, emails, physical address, and hours hydrate the global site footer and direct contact cards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#2563EB]" />
                    Primary Telephone Number
                  </span>
                </label>
                <input
                  type="text"
                  value={footer.contact.phonePrimary}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      contact: { ...footer.contact, phonePrimary: e.target.value },
                    })
                  }
                  placeholder="+254 (0)116 000100"
                  className={inputClass}
                />
                <span className="text-[11px] text-[#64748B] mt-1 block">Formatted telephone for calls and links</span>
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#2563EB]" />
                    Secondary / 24-7 Emergency Line
                  </span>
                </label>
                <input
                  type="text"
                  value={footer.contact.phoneSecondary}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      contact: { ...footer.contact, phoneSecondary: e.target.value },
                    })
                  }
                  placeholder="+254 (0)713 104907"
                  className={inputClass}
                />
                <span className="text-[11px] text-[#64748B] mt-1 block">Rapid dispatch standby number</span>
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#2563EB]" />
                    General Inquiries Email
                  </span>
                </label>
                <input
                  type="email"
                  value={footer.contact.emailPrimary}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      contact: { ...footer.contact, emailPrimary: e.target.value },
                    })
                  }
                  placeholder="specializedengineeringltd@gmail.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-[#2563EB]" />
                    Technical Support Email
                  </span>
                </label>
                <input
                  type="email"
                  value={footer.contact.emailSupport}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      contact: { ...footer.contact, emailSupport: e.target.value },
                    })
                  }
                  placeholder="info@specializedengineering.co.ke"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
                    Office Physical Address
                  </span>
                </label>
                <input
                  type="text"
                  value={footer.contact.officeAddress}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      contact: { ...footer.contact, officeAddress: e.target.value },
                    })
                  }
                  placeholder="Kilimani Business Hub, Nairobi, Kenya"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#2563EB]" />
                    Operating Hours &amp; Field Dispatch Notice
                  </span>
                </label>
                <input
                  type="text"
                  value={footer.contact.operatingHours}
                  onChange={(e) =>
                    setFooter({
                      ...footer,
                      contact: { ...footer.contact, operatingHours: e.target.value },
                    })
                  }
                  placeholder="Mon – Fri: 8:00 AM – 5:00 PM | 24/7 Emergency Dispatch"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Tagline & Consultation Section */}
          <div className="border border-[#E2E8F0] bg-white p-6 md:p-8 rounded-none">
            <div className="mb-6 border-b border-[#E2E8F0] pb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#0F172A]">
                Footer Brand Statement &amp; Consultation CTA
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Brand Tagline / Descriptive Summary</label>
                <textarea
                  rows={3}
                  value={footer.tagline}
                  onChange={(e) => setFooter({ ...footer, tagline: e.target.value })}
                  placeholder="Precision vertical engineering & elevator manufacturing..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Consultation Prompt Copy</label>
                <textarea
                  rows={3}
                  value={footer.consultationText}
                  onChange={(e) => setFooter({ ...footer, consultationText: e.target.value })}
                  placeholder="Connect with our Nairobi engineering team for certified shaft planning and tenders."
                  className={inputClass}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Consultation Button Label</label>
                  <input
                    type="text"
                    value={footer.consultationButtonLabel}
                    onChange={(e) =>
                      setFooter({ ...footer, consultationButtonLabel: e.target.value })
                    }
                    placeholder="Request Consultation"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Consultation Button Link</label>
                  <input
                    type="text"
                    value={footer.consultationButtonHref}
                    onChange={(e) =>
                      setFooter({ ...footer, consultationButtonHref: e.target.value })
                    }
                    placeholder="/contact"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-[#E2E8F0] pt-5">
              <button
                type="button"
                onClick={() => handleSave("footer")}
                disabled={saving}
                className="inline-flex min-h-11 items-center gap-2 bg-[#2563EB] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:opacity-50 rounded-none"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Contact Details</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FOOTER LINKS & SOCIAL MEDIA */}
      {activeTab === "links" && (
        <div className="space-y-6">
          {/* Quick Links List */}
          <div className="border border-[#E2E8F0] bg-white p-6 md:p-8 rounded-none">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-base font-bold uppercase tracking-wider text-[#0F172A]">
                  Dynamic Footer Links
                </h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Configure navigation links shown in the central columns of the footer.
                </p>
              </div>

              <button
                type="button"
                onClick={addQuickLink}
                className="inline-flex items-center gap-1.5 border border-[#2563EB] bg-blue-50 px-3.5 py-2 text-xs font-semibold text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition rounded-none"
              >
                <Plus className="h-4 w-4" />
                <span>Add Link</span>
              </button>
            </div>

            <div className="mb-6 max-w-sm">
              <label className={labelClass}>Column Header Title</label>
              <input
                type="text"
                value={footer.quickLinksTitle}
                onChange={(e) => setFooter({ ...footer, quickLinksTitle: e.target.value })}
                placeholder="Elevator Systems"
                className={inputClass}
              />
            </div>

            <div className="space-y-3">
              {footer.quickLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border border-[#E2E8F0] bg-slate-50/50 p-3 rounded-none"
                >
                  <span className="flex h-6 w-6 items-center justify-center bg-[#0F172A] text-[10px] font-bold text-white shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateQuickLink(idx, "label", e.target.value)}
                      placeholder="Link Label (e.g. Passenger Elevators)"
                      className="border border-[#CBD5E1] bg-white px-3 py-2 text-xs text-[#0F172A] outline-none rounded-none focus:border-[#2563EB]"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateQuickLink(idx, "href", e.target.value)}
                      placeholder="Destination URL (e.g. /elevators/passenger-elevator)"
                      className="border border-[#CBD5E1] bg-white px-3 py-2 text-xs text-[#0F172A] outline-none rounded-none focus:border-[#2563EB]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuickLink(idx)}
                    className="p-2 text-red-600 hover:bg-red-50 transition rounded-none shrink-0 self-end sm:self-center"
                    title="Remove link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="border border-[#E2E8F0] bg-white p-6 md:p-8 rounded-none">
            <div className="mb-6 border-b border-[#E2E8F0] pb-4">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#0F172A]">
                Social Media Channels
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Official social profile URLs for Facebook, Instagram, YouTube, TikTok, and LinkedIn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(
                [
                  { key: "facebook", label: "Facebook Page URL", placeholder: "https://www.facebook.com/..." },
                  { key: "instagram", label: "Instagram Profile URL", placeholder: "https://www.instagram.com/..." },
                  { key: "youtube", label: "YouTube Channel URL", placeholder: "https://www.youtube.com/..." },
                  { key: "tiktok", label: "TikTok Profile URL", placeholder: "https://www.tiktok.com/..." },
                  { key: "linkedin", label: "LinkedIn Company URL", placeholder: "https://www.linkedin.com/company/..." },
                ] as const
              ).map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <div className="flex">
                    <input
                      type="url"
                      value={footer.socials[key]}
                      onChange={(e) =>
                        setFooter({
                          ...footer,
                          socials: { ...footer.socials, [key]: e.target.value },
                        })
                      }
                      placeholder={placeholder}
                      className={inputClass}
                    />
                    {footer.socials[key] && (
                      <a
                        href={footer.socials[key]}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center border border-l-0 border-[#CBD5E1] bg-slate-100 px-3 text-[#475569] hover:text-[#2563EB] hover:bg-slate-200"
                        title="Test link"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              <div className="md:col-span-2">
                <label className={labelClass}>Bottom Bar Copyright Text</label>
                <input
                  type="text"
                  value={footer.copyrightText}
                  onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
                  placeholder="Specialized Engineering Kenya Ltd. All rights reserved."
                  className={inputClass}
                />
                <span className="text-[11px] text-[#64748B] mt-1 block">
                  The current year (e.g. © 2026) is automatically prepended.
                </span>
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-[#E2E8F0] pt-5">
              <button
                type="button"
                onClick={() => handleSave("footer")}
                disabled={saving}
                className="inline-flex min-h-11 items-center gap-2 bg-[#2563EB] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:opacity-50 rounded-none"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Links &amp; Socials</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRIVACY POLICY FULL TEXT CMS */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <div className="border border-[#E2E8F0] bg-white p-6 md:p-8 rounded-none">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#2563EB]" />
                  <h2 className="text-base font-bold uppercase tracking-wider text-[#0F172A]">
                    Privacy Policy Editor
                  </h2>
                </div>
                <p className="text-xs text-[#64748B] mt-1">
                  Full-text legal policy directly hydrating the <code className="text-[#2563EB]">/privacy</code> route.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPrivacyPreview(!showPrivacyPreview)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border rounded-none transition ${
                    showPrivacyPreview
                      ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                      : "border-[#CBD5E1] bg-white text-[#475569] hover:bg-slate-50"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{showPrivacyPreview ? "Hide Preview" : "Live Format Preview"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacy(defaultPrivacyPolicy)}
                  className="inline-flex items-center gap-1.5 border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition rounded-none"
                  title="Reset to default legal policy"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Load Default Template</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className={labelClass}>Document Title</label>
                <input
                  type="text"
                  value={privacy.title}
                  onChange={(e) => setPrivacy({ ...privacy, title: e.target.value })}
                  placeholder="Privacy Policy"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Badge / Eyebrow Tag</label>
                <input
                  type="text"
                  value={privacy.subtitle}
                  onChange={(e) => setPrivacy({ ...privacy, subtitle: e.target.value })}
                  placeholder="LEGAL & COMPLIANCE"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Last Updated String</label>
                <input
                  type="text"
                  value={privacy.updatedAt}
                  onChange={(e) => setPrivacy({ ...privacy, updatedAt: e.target.value })}
                  placeholder="Last updated: October 2026 · Specialized Engineering Kenya Ltd."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={showPrivacyPreview ? "" : "lg:col-span-2"}>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass}>Full Policy Text</label>
                  <span className="text-[11px] text-[#64748B]">
                    {privacy.bodyText.length} characters · {privacy.bodyText.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  rows={20}
                  value={privacy.bodyText}
                  onChange={(e) => setPrivacy({ ...privacy, bodyText: e.target.value })}
                  placeholder="Paste or write the complete privacy policy here..."
                  className="w-full border border-[#CBD5E1] bg-white p-4 font-mono text-xs leading-relaxed text-[#0F172A] outline-none rounded-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
                <span className="text-[11px] text-[#64748B] mt-2 block">
                  Numbered sections (e.g. <code>1. Overview</code>) and paragraph breaks are automatically styled with high-contrast editorial hierarchy on the public page.
                </span>
              </div>

              {showPrivacyPreview && (
                <div className="border border-[#E2E8F0] bg-[#FAFAFA] p-6 max-h-[500px] overflow-y-auto">
                  <div className="mb-4 pb-2 border-b border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Public Preview</span>
                    <span className="text-[10px] bg-blue-100 text-[#2563EB] px-2 py-0.5 font-bold uppercase">
                      {privacy.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold uppercase text-[#0F172A] mb-1">
                    {privacy.title}<span className="text-[#2563EB]">.</span>
                  </h3>
                  <p className="text-xs text-[#64748B] mb-6">{privacy.updatedAt}</p>

                  <div className="space-y-6 text-xs text-[#334155] leading-relaxed">
                    {privacy.bodyText
                      .split(/\n\n+/)
                      .map((paragraph, pIdx) => {
                        const trimmed = paragraph.trim();
                        const lines = trimmed.split("\n");
                        const firstLine = lines[0] || "";
                        const isHeading = /^\d+\.\s+/.test(firstLine);

                        if (isHeading) {
                          const rest = lines.slice(1).join("\n");
                          return (
                            <div key={pIdx} className="space-y-2">
                              <h4 className="font-bold text-sm text-[#0F172A] uppercase tracking-tight">
                                {firstLine}
                              </h4>
                              {rest && <p className="whitespace-pre-line text-[#475569]">{rest}</p>}
                            </div>
                          );
                        }
                        return (
                          <p key={pIdx} className="whitespace-pre-line text-[#475569]">
                            {trimmed}
                          </p>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end border-t border-[#E2E8F0] pt-5">
              <button
                type="button"
                onClick={() => handleSave("privacy")}
                disabled={saving}
                className="inline-flex min-h-11 items-center gap-2 bg-[#2563EB] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:opacity-50 rounded-none"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Privacy Policy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TERMS & CONDITIONS FULL TEXT CMS */}
      {activeTab === "terms" && (
        <div className="space-y-6">
          <div className="border border-[#E2E8F0] bg-white p-6 md:p-8 rounded-none">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#2563EB]" />
                  <h2 className="text-base font-bold uppercase tracking-wider text-[#0F172A]">
                    Terms &amp; Conditions Editor
                  </h2>
                </div>
                <p className="text-xs text-[#64748B] mt-1">
                  Full-text legal terms directly hydrating the <code className="text-[#2563EB]">/terms</code> route.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowTermsPreview(!showTermsPreview)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border rounded-none transition ${
                    showTermsPreview
                      ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                      : "border-[#CBD5E1] bg-white text-[#475569] hover:bg-slate-50"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{showTermsPreview ? "Hide Preview" : "Live Format Preview"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTerms(defaultTermsOfService)}
                  className="inline-flex items-center gap-1.5 border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition rounded-none"
                  title="Reset to default terms"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Load Default Template</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className={labelClass}>Document Title</label>
                <input
                  type="text"
                  value={terms.title}
                  onChange={(e) => setTerms({ ...terms, title: e.target.value })}
                  placeholder="Terms of Service"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Badge / Eyebrow Tag</label>
                <input
                  type="text"
                  value={terms.subtitle}
                  onChange={(e) => setTerms({ ...terms, subtitle: e.target.value })}
                  placeholder="LEGAL & COMPLIANCE"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Last Updated String</label>
                <input
                  type="text"
                  value={terms.updatedAt}
                  onChange={(e) => setTerms({ ...terms, updatedAt: e.target.value })}
                  placeholder="Last updated: October 2026 · Specialized Engineering Kenya Ltd."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={showTermsPreview ? "" : "lg:col-span-2"}>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelClass}>Full Terms &amp; Conditions Text</label>
                  <span className="text-[11px] text-[#64748B]">
                    {terms.bodyText.length} characters · {terms.bodyText.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  rows={20}
                  value={terms.bodyText}
                  onChange={(e) => setTerms({ ...terms, bodyText: e.target.value })}
                  placeholder="Paste or write the complete terms and conditions here..."
                  className="w-full border border-[#CBD5E1] bg-white p-4 font-mono text-xs leading-relaxed text-[#0F172A] outline-none rounded-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
                <span className="text-[11px] text-[#64748B] mt-2 block">
                  Numbered mandates (e.g. <code>1. Engineering Mandate</code>) and paragraph breaks are rendered cleanly on the public page.
                </span>
              </div>

              {showTermsPreview && (
                <div className="border border-[#E2E8F0] bg-[#FAFAFA] p-6 max-h-[500px] overflow-y-auto">
                  <div className="mb-4 pb-2 border-b border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Public Preview</span>
                    <span className="text-[10px] bg-blue-100 text-[#2563EB] px-2 py-0.5 font-bold uppercase">
                      {terms.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold uppercase text-[#0F172A] mb-1">
                    {terms.title}<span className="text-[#2563EB]">.</span>
                  </h3>
                  <p className="text-xs text-[#64748B] mb-6">{terms.updatedAt}</p>

                  <div className="space-y-6 text-xs text-[#334155] leading-relaxed">
                    {terms.bodyText
                      .split(/\n\n+/)
                      .map((paragraph, pIdx) => {
                        const trimmed = paragraph.trim();
                        const lines = trimmed.split("\n");
                        const firstLine = lines[0] || "";
                        const isHeading = /^\d+\.\s+/.test(firstLine);

                        if (isHeading) {
                          const rest = lines.slice(1).join("\n");
                          return (
                            <div key={pIdx} className="space-y-2">
                              <h4 className="font-bold text-sm text-[#0F172A] uppercase tracking-tight">
                                {firstLine}
                              </h4>
                              {rest && <p className="whitespace-pre-line text-[#475569]">{rest}</p>}
                            </div>
                          );
                        }
                        return (
                          <p key={pIdx} className="whitespace-pre-line text-[#475569]">
                            {trimmed}
                          </p>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end border-t border-[#E2E8F0] pt-5">
              <button
                type="button"
                onClick={() => handleSave("terms")}
                disabled={saving}
                className="inline-flex min-h-11 items-center gap-2 bg-[#2563EB] px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:opacity-50 rounded-none"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Terms of Service</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
