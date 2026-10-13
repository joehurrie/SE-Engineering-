"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Star,
} from "lucide-react";
import ImageDropzone from "@/components/ImageDropzone";

const ELEVATOR_CATEGORIES = [
  "Home Lift",
  "Passenger Elevator",
  "Escalator & Moving Walk",
  "Panoramic Elevator",
  "Hospital Elevator",
  "Freight Elevator & Car Elevator",
  "Dumbwaiter",
  "Hydraulic Platform",
];

type Product = {
  id: number;
  category: string;
  title: string;
  description: string;
  specifications: string | null;
  imageUrl: string;
  featured: boolean;
};

export default function AdminElevatorsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    category: "Passenger Elevator",
    title: "",
    description: "",
    specifications: "",
    imageUrl: "",
    featured: false,
  });

  useEffect(() => {
    let active = true;
    fetch("/api/admin/elevators")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.products) setProducts(data.products);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormError(null);
    setFormData({
      category: ELEVATOR_CATEGORIES[0],
      title: "",
      description: "",
      specifications: '{"capacity":"1000kg","speed":"1.75m/s"}',
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80",
      featured: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormError(null);
    setFormData({
      category: p.category,
      title: p.title,
      description: p.description,
      specifications: p.specifications || "",
      imageUrl: p.imageUrl,
      featured: p.featured,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this elevator product?")) return;
    try {
      const res = await fetch(`/api/admin/elevators/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.error || (res.status === 401 ? "Unauthorized: Please log in first." : "Failed to delete product."));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete elevator product.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editingProduct) {
        const res = await fetch(`/api/admin/elevators/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            setFormError("Unauthorized: Your session has expired or you are not logged in. Please log in.");
          } else {
            setFormError(data.error || "Failed to update elevator product.");
          }
          return;
        }
        if (data.product) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.product : p))
          );
        }
      } else {
        const res = await fetch("/api/admin/elevators", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            setFormError("Unauthorized: Your session has expired or you are not logged in. Please log in.");
          } else {
            setFormError(data.error || "Failed to create elevator product.");
          }
          return;
        }
        if (data.product) {
          setProducts((prev) => [data.product, ...prev]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError("A network error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const filtered =
    selectedCategory === "ALL"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold mb-2">
            Catalog Management
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
            Elevator Products CRUD
          </h1>
          <p className="text-sm text-[#475569] mt-1 font-normal">
            Manage models, specifications, and images for all 8 official elevator categories
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-[#0284C7] text-white text-xs font-semibold shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Elevator</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
            selectedCategory === "ALL"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-slate-50"
          }`}
        >
          All Categories ({products.length})
        </button>
        {ELEVATOR_CATEGORIES.map((cat) => {
          const count = products.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:bg-slate-50"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Products Table / Cards */}
      {loading ? (
        <div className="py-20 flex justify-center items-center gap-2 text-[#64748B] text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading products from Neon DB...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-none bg-white border border-[#E2E8F0] text-[#64748B] text-sm">
          No elevator products found in this category. Click &quot;Add New Elevator&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            // Safely parse JSON specifications if present
            let parsedSpecs: Record<string, string> | null = null;
            if (item.specifications) {
              try {
                const parsed = JSON.parse(item.specifications);
                if (typeof parsed === "object" && parsed !== null) {
                  parsedSpecs = parsed;
                }
              } catch {
                // Keep as plain text
              }
            }

            return (
              <div
                key={item.id}
                className="rounded-none bg-white border border-[#E2E8F0] overflow-hidden flex flex-col justify-between group hover:border-blue-500/50 hover:shadow-md transition duration-300 shadow-sm"
              >
                <div>
                  <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#0F172A] shadow-sm border border-slate-200/60">
                        {item.category}
                      </span>
                      {item.featured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 fill-white" /> Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-base text-[#0F172A] line-clamp-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {parsedSpecs ? (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#F1F5F9]">
                        {Object.entries(parsedSpecs).map(([k, v]) => (
                          <span
                            key={k}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-[#334155] font-medium"
                          >
                            <span className="text-[#94A3B8] capitalize">{k}:</span>
                            <span className="font-semibold">{String(v)}</span>
                          </span>
                        ))}
                      </div>
                    ) : item.specifications ? (
                      <div className="pt-2 border-t border-[#F1F5F9]">
                        <span className="inline-block p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-[#475569] font-mono truncate max-w-full">
                          Specs: {item.specifications}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="px-6 py-3.5 border-t border-[#E2E8F0] bg-slate-50/70 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#64748B]">ID #{item.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-[#475569] hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#E2E8F0] rounded-none max-w-lg w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">
                {editingProduct ? "Edit Elevator Model" : "Add New Elevator Model"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-none bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3">
                <span className="leading-relaxed">{formError}</span>
                {formError.includes("Unauthorized") && (
                  <a
                    href="/admin/login"
                    className="underline font-bold text-red-800 hover:text-red-900 shrink-0"
                  >
                    Log in &rarr;
                  </a>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  {ELEVATOR_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Prestige Villa Home Lift"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key features, engineering capabilities..."
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Specifications (JSON or Plain Text)
                </label>
                <input
                  type="text"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder='{"capacity": "1000kg", "speed": "1.75m/s"}'
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Product Image
                </label>
                <ImageDropzone
                  value={formData.imageUrl}
                  onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-[#CBD5E1] text-blue-600 focus:ring-blue-600 w-4 h-4"
                />
                <label htmlFor="featured" className="text-xs text-[#475569]">
                  Feature this model prominently on homepage and category head
                </label>
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
                  <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
