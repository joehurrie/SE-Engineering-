import type { Metadata } from "next";
import Image from "next/image";
import prisma from "@/lib/prisma";
import ProjectsGallery from "@/components/ProjectsGallery";
import GoogleProjectsMap from "@/components/GoogleProjectsMap";
import ScrollRevealPage from "@/components/ScrollRevealPage";
import { defaultProjects, type ProjectData } from "@/lib/project-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects Portfolio",
  description:
    "Explore 200+ vertical installations across residential high-rises, commercial headquarters, and private estates in Kenya and East Africa.",
};

export default async function ProjectsPage() {
  let projectList: ProjectData[] = defaultProjects;

  try {
    const dbProjects = await prisma.project.findMany({
      orderBy: { id: "asc" },
    });

    if (dbProjects && dbProjects.length > 0) {
      projectList = dbProjects.map((p) => {
        // Try to match or infer category
        let cat = "Commercial";
        if (p.projectType.toLowerCase().includes("residential") || p.projectName.toLowerCase().includes("villa") || p.projectName.toLowerCase().includes("apartment")) {
          cat = "Residential";
        } else if (p.projectType.toLowerCase().includes("escalator") || p.projectType.toLowerCase().includes("transit") || p.projectType.toLowerCase().includes("stadium")) {
          cat = "Public / Transit";
        }

        return {
          id: p.id,
          projectName: p.projectName,
          category: cat,
          projectType: p.projectType,
          description: p.description,
          elevatorCount: p.elevatorCount,
          location: p.location,
          latitude: p.latitude,
          longitude: p.longitude,
          img: p.imageUrl,
          galleryImages: p.galleryImages,
          featured: p.featured,
          status: p.status,
        };
      });
    }
  } catch (error) {
    console.error("Failed to load projects from DB:", error);
  }

  const heroImg = projectList[0]?.img || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1600";

  return (
    <ScrollRevealPage className="bg-white text-[#111111] min-h-screen">
      {/* ── 1. Hero: 50vh View Height (Centered) ───────────── */}
      <section className="min-h-screen pt-32 pb-16 relative overflow-hidden border-b border-neutral-900 flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImg}
            alt="Alina Harbor Towers Project"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            INSTALLATION SHOWCASE
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white mb-2 text-center">
            Success Projects.
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-4" />
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
            Over 200 precision vertical installations across residential high-rises, commercial headquarters,
            and private luxury estates in Kenya and East Africa.
          </p>
        </div>
      </section>

      {/* ── 2. Filter Tabs & Projects Showcase ─────────────────── */}
      <ProjectsGallery initialProjects={projectList} />
      <GoogleProjectsMap
        projects={projectList.flatMap((project) => {
          if (project.latitude === null || project.longitude === null) return [];
          return [{
            id: project.id,
            projectName: project.projectName,
            location: project.location,
            latitude: project.latitude,
            longitude: project.longitude,
          }];
        })}
      />
    </ScrollRevealPage>
  );
}
