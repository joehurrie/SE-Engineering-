import type { Metadata } from "next";
import Image from "next/image";
import prisma from "@/lib/prisma";
import ProjectsGallery from "@/components/ProjectsGallery";
import ScrollRevealPage from "@/components/ScrollRevealPage";
import type { ProjectData } from "@/lib/project-data";
import { getContentValue, loadSiteContentMap } from "@/lib/home-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Completed Projects — Elevator Installations Portfolio | Specialized Engineering Kenya",
  description:
    "Explore 200+ vertical transportation installations across residential high-rises, commercial headquarters, hotels, hospitals, and private estates in Kenya and East Africa.",
  keywords: [
    "elevator installations Kenya", "lift projects Nairobi", "completed elevator projects",
    "commercial elevator Kenya", "residential lift portfolio",
  ],
  openGraph: {
    title: "Elevator Installations Portfolio | Specialized Engineering Kenya",
    description: "200+ elevator and lift installations across Kenya and East Africa — residential, commercial, healthcare, and hospitality sectors.",
  },
};

export default async function ProjectsPage() {
  let projectList: ProjectData[] = [];
  let content: Awaited<ReturnType<typeof loadSiteContentMap>> = {};

  try {
    content = await loadSiteContentMap(["projects_hero", "projects_gallery"]);
  } catch (error) {
    console.error("Failed to load Projects page content:", error);
  }

  try {
    const dbProjects = await prisma.project.findMany({
      orderBy: { id: "asc" },
    });

    if (dbProjects && dbProjects.length > 0) {
      const withImages = dbProjects.filter((p) => Boolean(p.imageUrl && p.imageUrl.trim()));
      projectList = withImages.map((p) => {
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

  const hero = content.projects_hero;
  const gallery = content.projects_gallery;
  const heroImg = getContentValue(hero, "imageUrl", projectList[0]?.img || "/uploads/hero1.jpg");
  const videoUrl = hero?.videoUrl?.trim();

  return (
    <ScrollRevealPage className="bg-white text-[#111111] min-h-screen">
      {/* ── 1. Hero: Standardized Dimensions (100% view height on mobile, 70vh on desktop) ── */}
      <section className="relative flex min-h-[100svh] md:min-h-0 md:h-[70vh] items-center justify-center overflow-hidden border-b border-neutral-200 bg-[#F5F5F3] px-6 py-12 md:py-16 text-center">
        <div className="absolute inset-0 z-0">
          {videoUrl ? (
            <video src={videoUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <Image src={heroImg} alt="Alina Harbor Towers Project" fill priority sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            {getContentValue(hero, "subtitle", "INSTALLATION SHOWCASE")}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white drop-shadow-lg mb-2 text-center">
            {getContentValue(hero, "title", "Success Projects.")}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-4" />
          <p className="text-white drop-shadow-lg text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
            {getContentValue(hero, "bodyText", "Over 200 precision vertical installations across residential high-rises, commercial headquarters, and private luxury estates in Kenya and East Africa.")}
          </p>
        </div>
      </section>

      {/* ── 2. Projects Showcase ─────────────────── */}
      <ProjectsGallery
        initialProjects={projectList}
        badge={getContentValue(gallery, "badge", "Flagship Portfolio")}
        title={getContentValue(gallery, "title", "Landmark Developments.")}
        description={getContentValue(gallery, "bodyText", "Explore our completed and active vertical transportation projects across East Africa.")}
      />

    </ScrollRevealPage>
  );
}
