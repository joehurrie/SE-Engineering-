import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import ProjectsGallery, { ProjectItem } from "@/components/ProjectsGallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects Portfolio",
  description:
    "Explore 200+ vertical installations across residential high-rises, commercial headquarters, and private estates in Kenya and East Africa.",
};

const defaultProjects: ProjectItem[] = [
  {
    id: 1,
    projectName: "Alina Harbor Apartment",
    category: "Residential",
    projectType: "Luxury Multi-Family Residential Towers",
    elevatorCount: 12,
    location: "Kilimani, Nairobi",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
    featured: true,
    year: "2023",
    status: "Commissioned & Active",
  },
  {
    id: 2,
    projectName: "Apple Tree Apartments",
    category: "Commercial",
    projectType: "Commercial & Residential High-Rise",
    elevatorCount: 8,
    location: "Westlands, Nairobi",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    featured: true,
    year: "2022",
    status: "Commissioned & Active",
  },
  {
    id: 3,
    projectName: "Urban Oasis Towers",
    category: "Commercial",
    projectType: "Mixed High-Speed Elevator & Escalator Systems",
    elevatorCount: 6,
    location: "Upper Hill, Nairobi",
    img: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1200",
    featured: true,
    year: "2023",
    status: "Commissioned & Active",
  },
  {
    id: 4,
    projectName: "Zuri Villas Gated Community",
    category: "Residential",
    projectType: "Private Residential Glass Home Lifts",
    elevatorCount: 4,
    location: "Karen, Nairobi",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
    featured: false,
    year: "2021",
    status: "Commissioned & Active",
  },
  {
    id: 5,
    projectName: "Talanta Hela Complex",
    category: "Public / Transit",
    projectType: "Heavy-Duty Public Transit Escalator Installation",
    elevatorCount: 10,
    location: "Nairobi CBD",
    img: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=80&w=1200",
    featured: true,
    year: "2024",
    status: "Commissioned & Active",
  },
  {
    id: 6,
    projectName: "Greenpark Executive Offices",
    category: "Commercial",
    projectType: "Commercial Passenger Elevator Installation & Maintenance",
    elevatorCount: 16,
    location: "Thika Road Corridor",
    img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=1200",
    featured: false,
    year: "2024",
    status: "Commissioned & Active",
  },
];

export default async function ProjectsPage() {
  let projectList: ProjectItem[] = defaultProjects;

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
          elevatorCount: p.elevatorCount,
          location: p.location,
          img: p.imageUrl,
          featured: p.featured,
          year: "Active",
          status: "Commissioned & Active",
        };
      });
    }
  } catch (error) {
    console.error("Failed to load projects from DB:", error);
  }

  const heroImg = projectList[0]?.img || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1600";

  return (
    <div className="bg-white text-[#111111] min-h-screen">
      {/* ── 1. Hero: 50vh View Height (Centered) ───────────── */}
      <section className="min-h-[50vh] min-h-[50svh] min-h-[380px] pt-32 pb-16 relative overflow-hidden border-b border-neutral-900 flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Alina Harbor Towers Project"
            className="w-full h-full object-cover brightness-[0.25]"
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
    </div>
  );
}
