"use client";

import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import type { ProjectData } from "@/lib/project-data";

export type ProjectItem = ProjectData;

type ProjectsGalleryProps = {
  initialProjects: ProjectItem[];
  badge?: string;
  title?: string;
  description?: string;
};

export default function ProjectsGallery({
  initialProjects,
  badge = "Flagship Portfolio",
  title = "Landmark Developments.",
  description = "Explore our completed and active vertical transportation projects across East Africa.",
}: ProjectsGalleryProps) {
  return (
    <section className="w-full min-h-screen py-32 md:py-48 bg-neutral-50 border-b border-neutral-200 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-6 space-y-20 flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-3.5 py-1.5 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest border border-neutral-200">
            {badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black text-center">
            {title}
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto" />
          <p className="text-neutral-600 text-base md:text-lg font-light leading-relaxed text-center max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {initialProjects.map((proj) => (
            <div
              key={proj.id}
              className="group rounded-none overflow-hidden bg-white border border-neutral-200 hover:border-blue-600/40 flex flex-col justify-between relative h-full transition-all duration-300 hover:shadow-xl"
            >
              <div>
                <div className="h-72 sm:h-80 md:h-96 lg:h-[420px] w-full relative overflow-hidden bg-neutral-100">
                  <Image
                    src={proj.img}
                    alt={proj.projectName}
                    fill
                    quality={95}
                    sizes="(min-width: 1280px) 420px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors" />

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
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight text-black group-hover:text-blue-600 transition-colors">
                    {proj.projectName}
                  </h3>

                  <p className="truncate text-sm text-neutral-500 font-light leading-relaxed">
                    {proj.projectType}
                  </p>
                </div>
              </div>

              <div className="flex justify-end px-6 pb-5 pt-0 md:px-7 md:pb-6">
                <Link
                  href={`/projects/${proj.id}`}
                  aria-label={`View project: ${proj.projectName}`}
                  className="inline-flex h-10 w-10 items-center justify-center text-neutral-500 transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
