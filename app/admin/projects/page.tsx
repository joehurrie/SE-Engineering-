"use client";

import { useEffect, useState } from "react";
import { FolderGit2, Plus, Edit2, Trash2, Loader2, X, Star, MapPin } from "lucide-react";
import ImageDropzone from "@/components/ImageDropzone";

type Project = {
  id: number;
  projectName: string;
  projectType: string;
  elevatorCount: number;
  location: string | null;
  imageUrl: string;
  featured: boolean;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "Luxury Multi-Family Residential",
    elevatorCount: 4,
    location: "Kilimani, Nairobi",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData({
      projectName: "",
      projectType: "High-Rise Commercial Tower",
      elevatorCount: 6,
      location: "Westlands, Nairobi",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      featured: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setFormData({
      projectName: p.projectName,
      projectType: p.projectType,
      elevatorCount: p.elevatorCount,
      location: p.location || "",
      imageUrl: p.imageUrl,
      featured: p.featured,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProject) {
        const res = await fetch(`/api/admin/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.project) {
          setProjects((prev) =>
            prev.map((p) => (p.id === editingProject.id ? data.project : p))
          );
        }
      } else {
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.project) {
          setProjects((prev) => [data.project, ...prev]);
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
            Portfolio Management
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
            Projects Portfolio CRUD
          </h1>
          <p className="text-sm text-[#475569] mt-1 font-normal">
            Showcase successful vertical installations across Alina Harbor, Apple Tree, Urban Oasis, and more
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-[#0284C7] text-white text-xs font-semibold shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center gap-2 text-[#64748B] text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span>Loading portfolio items from Neon DB...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] text-sm">
          No projects found. Click &quot;Add New Project&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-xl bg-white border border-[#E2E8F0] overflow-hidden flex flex-col justify-between group hover:border-blue-600/40 hover:shadow-md transition shadow-sm"
            >
              <div>
                <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={proj.imageUrl}
                    alt={proj.projectName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
                      {proj.elevatorCount} Elevators Installed
                    </span>
                    {proj.featured && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-white" /> Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-base text-[#0F172A]">{proj.projectName}</h3>
                  <p className="text-xs text-blue-600 font-semibold mt-1">{proj.projectType}</p>
                  {proj.location && (
                    <div className="flex items-center gap-1 text-xs text-[#475569] mt-2">
                      <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                      <span>{proj.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#E2E8F0] bg-slate-50/60 flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">ID #{proj.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg text-[#475569] hover:text-blue-600 hover:bg-blue-50 transition"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
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
                {editingProject ? "Edit Project Portfolio" : "Add Project Portfolio"}
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
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. Alina Harbor Apartment"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Project Type
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  placeholder="e.g. Luxury Multi-Family Residential"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Elevators Installed
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.elevatorCount}
                    onChange={(e) => setFormData({ ...formData, elevatorCount: Number(e.target.value) })}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Kilimani, Nairobi"
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Project Image
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
                  id="projFeatured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-[#CBD5E1] text-blue-600 focus:ring-blue-600 w-4 h-4"
                />
                <label htmlFor="projFeatured" className="text-xs text-[#475569]">
                  Feature on website homepage showcase
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
                  <span>{editingProject ? "Save Changes" : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
