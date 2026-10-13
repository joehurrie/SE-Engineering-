"use client";

import { useEffect, useState } from "react";
import { FileEdit, Save, Loader2, CheckCircle } from "lucide-react";
import ImageDropzone from "@/components/ImageDropzone";

type ContentItem = {
  id?: number;
  sectionKey: string;
  title: string | null;
  subtitle: string | null;
  bodyText: string | null;
  imageUrl: string | null;
};

export default function AdminContentPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.contents) setContents(data.contents);
      })
      .catch(() => {
        if (active) setError("Failed to load content sections.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleFieldChange = (
    key: string,
    field: "title" | "subtitle" | "bodyText" | "imageUrl",
    value: string
  ) => {
    setContents((prev) =>
      prev.map((c) => (c.sectionKey === key ? { ...c, [field]: value } : c))
    );
  };

  const handleSave = async (item: ContentItem) => {
    setSavingKey(item.sectionKey);
    setError(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!res.ok) {
        throw new Error("Failed to save changes");
      }

      setSavedKey(item.sectionKey);
      setTimeout(() => setSavedKey(null), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error saving content.");
      }
    } finally {
      setSavingKey(null);
    }
  };

  const formatKeyName = (key: string) => {
    switch (key) {
      case "home_hero":
        return "Homepage Hero Banner";
      case "about_intro":
        return "About Us Corporate Profile";
      case "contact_info":
        return "Contact Details & Offices";
      default:
        return key.replace(/_/g, " ").toUpperCase();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-[#64748B] gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        <span>Loading editable site copy from Neon Database...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl w-full mx-auto">
      <div className="border-b border-[#E2E8F0] pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-2">
          Content Management System
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
          Static Copy & Text Management
        </h1>
        <p className="text-sm text-[#475569] mt-1 font-normal">
          Non-technical staff can modify headline text, company introduction, phone numbers, and images below.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-none bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {contents.map((item) => (
          <div
            key={item.sectionKey}
              className="p-6 rounded-none bg-white border border-[#E2E8F0] shadow-sm space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0F172A]">{formatKeyName(item.sectionKey)}</h2>
                  <span className="font-mono text-xs text-[#64748B]">key: {item.sectionKey}</span>
                </div>
              </div>

              <button
                onClick={() => handleSave(item)}
                disabled={savingKey === item.sectionKey}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-[#0284C7] text-white font-semibold text-xs shadow-sm transition disabled:opacity-50"
              >
                {savingKey === item.sectionKey ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : savedKey === item.sectionKey ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                    <span>Saved to Neon!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                  Main Headline / Title
                </label>
                <input
                  type="text"
                  value={item.title || ""}
                  onChange={(e) => handleFieldChange(item.sectionKey, "title", e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={item.subtitle || ""}
                  onChange={(e) => handleFieldChange(item.sectionKey, "subtitle", e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                Body Copy / Description Text
              </label>
              <textarea
                rows={4}
                value={item.bodyText || ""}
                onChange={(e) => handleFieldChange(item.sectionKey, "bodyText", e.target.value)}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-4 py-3 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">
                Section Background / Featured Image
              </label>
              <ImageDropzone
                value={item.imageUrl || ""}
                onChange={(url) => handleFieldChange(item.sectionKey, "imageUrl", url)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
