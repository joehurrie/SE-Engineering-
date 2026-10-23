import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, MapPin } from "lucide-react";
import type { ProjectData } from "@/lib/project-data";

export default function ProjectDetailView({
  project,
  relatedProjects,
}: {
  project: ProjectData;
  relatedProjects: ProjectData[];
}) {
  const galleryImages = Array.isArray(project.galleryImages) ? project.galleryImages : [];
  const gallery = Array.from(
    new Set(
      [project.img, ...galleryImages].filter(
        (image): image is string => typeof image === "string" && image.length > 0,
      ),
    ),
  );
  const statusLabel = project.status === "ACTIVE" ? "Active" : "Commissioned";

  return (
    <main className="min-h-screen bg-white text-[#0F0F0F]">
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-[#F5F5F3] px-6 py-32 text-white">
        <Image
          src={project.img}
          alt={project.projectName}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <Link
            href="/projects"
            className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white drop-shadow-lg transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            All projects
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em]">
            <span className="bg-[#2563EB] px-3 py-1.5 text-white">{project.projectType}</span>
            <span className="inline-flex items-center gap-1.5 border border-white/60 px-3 py-1.5 text-white drop-shadow-lg">
              <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-[#60A5FA]" />
              {statusLabel}
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold uppercase leading-tight tracking-tight drop-shadow-lg sm:text-5xl md:text-7xl">
            {project.projectName}
          </h1>
          {project.location && (
            <p className="mt-5 flex items-center gap-2 text-sm text-white drop-shadow-lg">
              <MapPin aria-hidden="true" className="h-4 w-4 text-[#60A5FA]" />
              {project.location}
            </p>
          )}
        </div>
      </section>

      <section className="bg-[#F5F5F3] px-6 py-16 md:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2563EB]">
              <span className="h-px w-8 bg-[#2563EB]" />
              Project overview
            </p>
            <h2 className="mt-6 text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              Engineered around the building.
            </h2>
            <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-8 text-neutral-600 md:text-lg">
              {project.description || `${project.projectType} delivered for ${project.projectName}.`}
            </p>
          </div>

          <div className="bg-[#111827] p-6 text-white sm:p-8 md:p-10">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Project at a glance
              </p>
              <Building2 aria-hidden="true" className="h-5 w-5 text-[#60A5FA]" />
            </div>
            <div className="flex items-end gap-3 py-7">
              <span className="text-6xl font-semibold leading-none tracking-tight text-white sm:text-7xl">
                {project.elevatorCount}
              </span>
              <span className="pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Units delivered
              </span>
            </div>
            <dl className="divide-y divide-white/15 border-t border-white/15">
              <div className="py-4 sm:flex sm:items-start sm:justify-between sm:gap-8">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                  System type
                </dt>
                <dd className="mt-2 text-sm font-medium leading-6 text-white sm:mt-0 sm:max-w-[65%] sm:text-right">
                  {project.projectType}
                </dd>
              </div>
              <div className="py-4 sm:flex sm:items-center sm:justify-between sm:gap-8">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                  Location
                </dt>
                <dd className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-white sm:mt-0 sm:text-right">
                  <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#60A5FA]" />
                  {project.location || "East Africa"}
                </dd>
              </div>
              <div className="py-4 sm:flex sm:items-center sm:justify-between sm:gap-8">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                  Status
                </dt>
                <dd className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-white sm:mt-0">
                  <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#60A5FA]" />
                  {statusLabel}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F3] py-16 md:py-24">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2563EB]">Project photos</p>
            <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight">Installation gallery</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                <Image
                  src={image}
                  alt={`${project.projectName} project photo ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="bg-white px-6 py-16 md:py-24">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2563EB]">
                  More from our portfolio
                </p>
                <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                  View more projects
                </h2>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 self-start border-b border-neutral-300 pb-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:border-[#2563EB] hover:text-[#2563EB] sm:self-auto"
              >
                All projects <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.id}`}
                  className="group border border-neutral-200 bg-white transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <Image
                      src={relatedProject.img}
                      alt={relatedProject.projectName}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold uppercase tracking-tight group-hover:text-[#2563EB]">
                        {relatedProject.projectName}
                      </h3>
                      <p className="mt-2 truncate text-sm text-neutral-500">
                        {relatedProject.location || relatedProject.projectType}
                      </p>
                    </div>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-[#2563EB] transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-neutral-100 px-6 py-16 text-neutral-900 md:py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700">
              Your next project
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Ready to plan your next lift?
            </h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Talk with our team about the right vertical transportation solution for your building.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 shrink-0 items-center gap-3 bg-blue-700 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-blue-800"
          >
            Request a quote <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
