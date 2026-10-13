"use client";

import { useState } from "react";
import { Building2, ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export type ProjectItem = {
  id: number;
  projectName: string;
  category: string;
  projectType: string;
  elevatorCount: number;
  location: string | null;
  img: string;
  featured: boolean;
  year?: string;
  status?: string;
};

const categories = ["All Projects", "Residential", "Commercial", "Public / Transit"];

export default function ProjectsGallery({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All Projects");

  const filteredProjects =
    activeCategory === "All Projects"
      ? initialProjects
      : initialProjects.filter((p) => p.category.toLowerCase().includes(activeCategory.toLowerCase()) || (activeCategory.includes("Residential") && p.projectType.toLowerCase().includes("residential")) || (activeCategory.includes("Commercial") && p.projectType.toLowerCase().includes("commercial")) || (activeCategory.includes("Public") && p.projectType.toLowerCase().includes("transit")));

  return (
    <section className="w-full min-h-screen py-32 md:py-48 bg-neutral-50 border-b border-neutral-200 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-6 space-y-20 flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-3.5 py-1.5 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest border border-neutral-200">
            Flagship Portfolio
          </div>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black text-center">
            Landmark Developments.
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto" />
          <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed text-center max-w-xl mx-auto">
            Explore our completed and active vertical transportation projects across East Africa.
          </p>

          {/* Filter Buttons Centered */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-6 py-3.5 rounded-none transition-colors border ${
                  activeCategory === cat
                    ? "bg-black text-white border-black font-semibold"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-black hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="group rounded-none overflow-hidden bg-white border border-neutral-200 hover:border-blue-600/40 flex flex-col justify-between relative h-full transition-all duration-300 hover:shadow-xl"
            >
              <div>
                <div className="h-64 w-full relative overflow-hidden bg-neutral-100">
                  <img
                    src={proj.img}
                    alt={proj.projectName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors" />

                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className="px-3 py-1 text-xs font-bold bg-white text-black flex items-center gap-1.5 shadow-sm">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      {proj.elevatorCount} Units
                    </span>
                    {proj.featured && (
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white drop-shadow">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      {proj.location || "Nairobi, Kenya"}
                    </span>
                    {proj.year && <span className="font-mono text-neutral-300">{proj.year}</span>}
                  </div>
                </div>

                <div className="space-y-4 p-6 md:p-7">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      {proj.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      {proj.status || "Commissioned"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight text-black group-hover:text-blue-600 transition-colors">
                    {proj.projectName}
                  </h3>

                  <p className="text-sm text-neutral-500 font-light leading-relaxed">
                    {proj.projectType}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-1 md:px-7 md:pb-7">
                <Link
                  href="/contact"
                  className="w-full py-3.5 bg-neutral-100 hover:bg-black hover:text-white text-neutral-900 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <span>Request Similar Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
