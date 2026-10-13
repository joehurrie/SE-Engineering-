"use client";

import { useEffect, useState } from "react";
import { Newspaper, Plus, Edit2, Trash2, Loader2, X, Calendar } from "lucide-react";
import ImageDropzone from "@/components/ImageDropzone";

type Article = {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  publishedAt: string;
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80",
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      if (data.articles) setArticles(data.articles);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (a: Article) => {
    setEditingArticle(a);
    setFormData({
      title: a.title,
      slug: a.slug,
      content: a.content,
      imageUrl: a.imageUrl || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingArticle) {
        const res = await fetch(`/api/admin/news/${editingArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.article) {
          setArticles((prev) =>
            prev.map((a) => (a.id === editingArticle.id ? data.article : a))
          );
        }
      } else {
        const res = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.article) {
          setArticles((prev) => [data.article, ...prev]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-2">
            Editorial CMS
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
            News & Articles CRUD
          </h1>
          <p className="text-sm text-[#475569] mt-1 font-normal">
            Publish corporate announcements, elevator safety guidelines, and technology releases
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-[#0284C7] text-white text-xs font-semibold shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Article</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center gap-2 text-[#64748B] text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading articles from Neon DB...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] text-sm">
          No articles published yet. Click &quot;Publish Article&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((art) => (
            <div
              key={art.id}
              className="rounded-xl bg-white border border-[#E2E8F0] overflow-hidden flex flex-col justify-between group hover:border-blue-600/40 hover:shadow-md transition shadow-sm"
            >
              <div>
                {art.imageUrl && (
                  <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#0F172A] line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#475569] mt-2 line-clamp-3 leading-relaxed">
                    {art.content}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#E2E8F0] bg-slate-50/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#64748B] truncate max-w-[140px]">
                  /{art.slug}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="p-1.5 rounded-lg text-[#475569] hover:text-blue-600 hover:bg-blue-50 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">
                {editingArticle ? "Edit Article" : "Publish New Article"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Energy Efficient Traction Elevators Launched in Kenya"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  URL Slug (Optional - auto-generated if blank)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="energy-efficient-elevators-kenya"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Content / Article Body
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write full article news..."
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Header Image
                </label>
                <ImageDropzone
                  value={formData.imageUrl}
                  onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#475569] hover:text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-[#0284C7] text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50 shadow-sm"
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
