"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Calendar,
  Star,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  SlidersHorizontal,
} from "lucide-react";
import ImageDropzone from "@/components/ImageDropzone";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  category: string;
  featured: boolean;
  publishedAt: string;
};

const CATEGORY_OPTIONS = [
  "Engineering News",
  "Project Update",
  "Corporate Partnership",
  "Corporate Milestone",
  "Engineering Insight",
  "Preventative Maintenance",
];

const DEFAULT_HEADER_IMAGE =
  "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80";

function formatDateForInput(dateStr: string | undefined): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "featured" | "standard">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Engineering News",
    publishedAt: new Date().toISOString().split("T")[0],
    featured: false,
    imageUrl: DEFAULT_HEADER_IMAGE,
    excerpt: "",
    content: "",
  });

  const notify = (msg: string) => {
    setNotification(msg);
    window.setTimeout(() => setNotification((prev) => (prev === msg ? null : prev)), 3500);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/news")
      .then((res) => res.json())
      .then((data) => {
        if (active && Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      })
      .catch((err) => {
        console.error("Failed to load articles:", err);
        if (active) setError("Could not load news articles from server.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      category: "Engineering News",
      publishedAt: new Date().toISOString().split("T")[0],
      featured: false,
      imageUrl: DEFAULT_HEADER_IMAGE,
      excerpt: "",
      content: "",
    });
    setError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      slug: art.slug,
      category: art.category || "Engineering News",
      publishedAt: formatDateForInput(art.publishedAt),
      featured: Boolean(art.featured),
      imageUrl: art.imageUrl || DEFAULT_HEADER_IMAGE,
      excerpt: art.excerpt || "",
      content: art.content || "",
    });
    setError(null);
    setModalOpen(true);
  };

  const handleToggleFeatured = async (art: Article) => {
    const newFeatured = !art.featured;
    setTogglingId(art.id);
    try {
      const res = await fetch(`/api/admin/news/${art.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newFeatured }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update article");
      setArticles((prev) =>
        prev.map((item) => (item.id === art.id ? { ...item, featured: newFeatured } : item))
      );
      notify(newFeatured ? "Article added to Featured Stories" : "Article removed from Featured Stories");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to toggle featured status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        notify("Article deleted successfully");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete article");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete article");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Article heading and body content are required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (editingArticle) {
        const res = await fetch(`/api/admin/news/${editingArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save article changes.");
        if (data.article) {
          setArticles((prev) =>
            prev.map((a) => (a.id === editingArticle.id ? data.article : a))
          );
          notify("Article updated successfully");
        }
      } else {
        const res = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to publish new article.");
        if (data.article) {
          setArticles((prev) => [data.article, ...prev]);
          notify("Article published successfully");
        }
      }
      setModalOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Filtered article list
  const filteredArticles = articles.filter((art) => {
    if (filterMode === "featured" && !art.featured) return false;
    if (filterMode === "standard" && art.featured) return false;
    if (selectedCategory !== "all" && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inTitle = art.title.toLowerCase().includes(q);
      const inContent = art.content.toLowerCase().includes(q);
      const inCategory = art.category.toLowerCase().includes(q);
      const inSlug = art.slug.toLowerCase().includes(q);
      if (!inTitle && !inContent && !inCategory && !inSlug) return false;
    }
    return true;
  });

  const featuredCount = articles.filter((a) => a.featured).length;
  const standardCount = articles.length - featuredCount;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-6 md:p-8 font-sans">
      {/* ── 1. Page Header ─────────────────────────────────────── */}
      <header className="border-b border-[#E2E8F0] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2563EB] rounded-none">
            <FileText className="h-3.5 w-3.5" />
            Editorial News CMS
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] md:text-3xl">
            News &amp; Editorial Management
          </h1>
          <p className="mt-1 text-sm text-[#475569]">
            Publish corporate announcements, technical case studies, upload imagery, and spotlight featured stories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/news"
            target="_blank"
            className="inline-flex items-center gap-1.5 border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition rounded-none"
          >
            <span>View News Page Live</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition rounded-none shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Publish Article</span>
          </button>
        </div>
      </header>

      {/* Notifications & Error Banners */}
      {notification && (
        <div className="border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 rounded-none">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}
      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800 flex items-center gap-2 rounded-none">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── 2. Stat Summary & Quick Filters ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setFilterMode("all")}
          className={`p-4 border text-left rounded-none transition ${
            filterMode === "all"
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-[#E2E8F0] bg-white hover:bg-slate-50"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">All Published</div>
          <div className="text-2xl font-bold text-[#0F172A] mt-1">{articles.length}</div>
          <div className="text-[11px] text-[#64748B] mt-0.5">Total articles in database</div>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode("featured")}
          className={`p-4 border text-left rounded-none transition ${
            filterMode === "featured"
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-[#E2E8F0] bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Featured Stories
            </span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] mt-1">{featuredCount}</div>
          <div className="text-[11px] text-[#64748B] mt-0.5">Spotlighted at top of /news</div>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode("standard")}
          className={`p-4 border text-left rounded-none transition ${
            filterMode === "standard"
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-[#E2E8F0] bg-white hover:bg-slate-50"
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Regular Archive</div>
          <div className="text-2xl font-bold text-[#0F172A] mt-1">{standardCount}</div>
          <div className="text-[11px] text-[#64748B] mt-0.5">Standard archive articles</div>
        </button>
      </div>

      {/* ── 3. Search & Filter Bar ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#E2E8F0] bg-white p-4 rounded-none">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, slug, content..."
            className="w-full pl-9 pr-3.5 py-2 text-xs border border-[#CBD5E1] bg-white text-[#0F172A] outline-none rounded-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-[#CBD5E1] bg-white text-[#0F172A] px-3 py-2 outline-none rounded-none focus:border-[#2563EB]"
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {(searchQuery || filterMode !== "all" || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setFilterMode("all");
                setSelectedCategory("all");
              }}
              className="text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* ── 4. Article Grid ────────────────────────────────────── */}
      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-12 text-[#64748B]">
          <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
          <span className="text-xs uppercase tracking-wider font-semibold">Loading Articles from Database…</span>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="border border-[#E2E8F0] bg-white p-12 text-center text-sm text-[#64748B] rounded-none space-y-3">
          <p className="font-semibold text-neutral-800">No articles match your search or filter.</p>
          <p className="text-xs text-neutral-500">
            Try adjusting your search criteria or click &quot;Publish Article&quot; to create a new one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => {
            const isFeatured = art.featured;
            const isToggling = togglingId === art.id;

            return (
              <div
                key={art.id}
                className={`border bg-white rounded-none overflow-hidden flex flex-col justify-between shadow-sm transition hover:shadow-md ${
                  isFeatured ? "border-blue-400 ring-1 ring-blue-300/50" : "border-[#E2E8F0] hover:border-slate-300"
                }`}
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden group">
                    {art.imageUrl ? (
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 uppercase font-mono tracking-wider">
                        No Image Uploaded
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-900/85 backdrop-blur-sm text-white border border-white/10">
                        {art.category || "Engineering News"}
                      </span>

                      {isFeatured && (
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 fill-white" />
                          Featured Story
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        {new Date(art.publishedAt).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#0F172A] line-clamp-2 leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-[#475569] font-light line-clamp-3 leading-relaxed">
                      {art.excerpt || art.content}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3 border-t border-[#E2E8F0] bg-slate-50/70 flex items-center justify-between gap-2">
                  {/* Quick Toggle for Featured */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(art)}
                    disabled={isToggling}
                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 border transition rounded-none ${
                      isFeatured
                        ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                    title={isFeatured ? "Click to remove from featured stories" : "Click to spotlight in featured stories"}
                  >
                    {isToggling ? (
                      <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                    ) : (
                      <Star
                        className={`w-3 h-3 ${isFeatured ? "text-blue-600 fill-blue-600" : "text-slate-400"}`}
                      />
                    )}
                    <span>{isFeatured ? "Featured" : "Standard"}</span>
                  </button>

                  {/* Edit / View / Delete */}
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/news/${art.slug}`}
                      target="_blank"
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="View article on live website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(art)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Edit article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(art.id, art.title)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 transition"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 5. Add / Edit Modal ─────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#CBD5E1] rounded-none max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  {editingArticle ? "Edit Article" : "Publish New Article"}
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Configure headline, publication date, image, body content, and featured story status.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Heading / Title */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Article Heading / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const nextTitle = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      title: nextTitle,
                      // Auto-update slug if adding new article or slug is currently empty
                      slug:
                        !editingArticle && (!prev.slug || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""))
                          ? nextTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
                          : prev.slug,
                    }));
                  }}
                  placeholder="e.g. Specialized Engineering Launches Energy-Efficient Regenerative Lift Drives"
                  className="w-full bg-white border border-[#CBD5E1] rounded-none px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* URL Slug & Publication Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="energy-efficient-regenerative-lift-drives"
                    className="w-full bg-white border border-[#CBD5E1] rounded-none px-3.5 py-2.5 text-xs font-mono text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-[10px] text-[#64748B] mt-1 block">
                    Path will be /news/{formData.slug || "your-slug"}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Publication Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="w-full bg-white border border-[#CBD5E1] rounded-none px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Category & Featured Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      list="category-suggestions"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Engineering News"
                      className="w-full bg-white border border-[#CBD5E1] rounded-none px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                    <datalist id="category-suggestions">
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Featured Story Spotlight Toggle */}
                <div className="pt-2 md:pt-4">
                  <label className="flex items-start gap-3 p-3 border border-blue-200 bg-blue-50/60 cursor-pointer rounded-none hover:bg-blue-50 transition">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded-none text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>Featured Story Spotlight</span>
                      </div>
                      <p className="text-[11px] text-[#475569] leading-tight">
                        Highlight this story in the primary 2-column spotlight grid at the top of the news page.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Image Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Header Image (Upload or Paste URL)
                </label>
                <ImageDropzone
                  value={formData.imageUrl}
                  onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                />
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Excerpt / Summary (Optional teaser copy)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A concise 1-2 sentence overview of the announcement shown in previews..."
                  className="w-full bg-white border border-[#CBD5E1] rounded-none px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Body Content */}
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Full Article Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full news story or technical release here. Separate paragraphs with double line-breaks..."
                  className="w-full bg-white border border-[#CBD5E1] rounded-none px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                />
                <span className="text-[10px] text-[#64748B] mt-1 block">
                  Paragraphs separated by a blank line will render as distinct sections on the story page.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-none border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-none bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 shadow-sm transition"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingArticle ? "Save Changes" : "Publish Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
