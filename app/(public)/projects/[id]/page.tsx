import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProjectDetailView from "@/components/ProjectDetailView";
import ScrollRevealPage from "@/components/ScrollRevealPage";
import { defaultProjects, type ProjectData } from "@/lib/project-data";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.specializedengineeringltd.co.ke";

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId < 1) {
    return { title: "Project | Specialized Engineering Kenya Ltd." };
  }

  let project: Awaited<ReturnType<typeof prisma.project.findUnique>> = null;
  try {
    project = await prisma.project.findUnique({ where: { id: projectId } });
  } catch (error) {
    console.error("Failed to load project metadata:", error);
  }

  const title = project
    ? `${project.projectName} | Specialized Engineering Kenya Ltd.`
    : "Project | Specialized Engineering Kenya Ltd.";
  const description =
    project?.description ||
    project?.projectType ||
    "Elevator installation and engineering project by Specialized Engineering Kenya Ltd.";
  const imageUrl = project?.imageUrl
    ? project.imageUrl.startsWith("http")
      ? project.imageUrl
      : `${SITE_URL}${project.imageUrl}`
    : `${SITE_URL}/og-image.jpeg`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/projects/${projectId}` },
    openGraph: {
      url: `${SITE_URL}/projects/${projectId}`,
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: project?.projectName ?? "Project" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId < 1) notFound();

  let dbProjects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  try {
    dbProjects = await prisma.project.findMany({ orderBy: { id: "asc" } });
  } catch (error) {
    console.error("Failed to load project details:", error);
  }
  const dbProject = dbProjects.length > 0
    ? dbProjects.find((item) => item.id === projectId)
    : null;
  const project = dbProject
    ? {
        id: dbProject.id,
        projectName: dbProject.projectName,
        category: "Project",
        projectType: dbProject.projectType,
        description: dbProject.description,
        elevatorCount: dbProject.elevatorCount,
        location: dbProject.location,
        latitude: dbProject.latitude,
        longitude: dbProject.longitude,
        img: dbProject.imageUrl,
        galleryImages: dbProject.galleryImages,
        featured: dbProject.featured,
        status: dbProject.status,
      }
    : null;

  if (!project) notFound();

  const relatedProjects: ProjectData[] = (dbProjects.length > 0
    ? dbProjects.map((item) => ({
        id: item.id,
        projectName: item.projectName,
        category: "Project",
        projectType: item.projectType,
        description: item.description,
        elevatorCount: item.elevatorCount,
        location: item.location,
        latitude: item.latitude,
        longitude: item.longitude,
        img: item.imageUrl,
        galleryImages: item.galleryImages,
        featured: item.featured,
        status: item.status,
      }))
    : defaultProjects
  )
    .filter((item) => item.id !== project.id)
    .slice(0, 3);

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.projectName,
    description: project.description || `Elevator installation project: ${project.projectName}`,
    image: project.img
      ? project.img.startsWith("http")
        ? project.img
        : `${SITE_URL}${project.img}`
      : `${SITE_URL}/og-image.jpeg`,
    provider: {
      "@type": "Organization",
      name: "Specialized Engineering Kenya Ltd.",
      url: SITE_URL,
    },
    ...(project.location
      ? {
          locationCreated: {
            "@type": "Place",
            name: project.location,
          },
        }
      : {}),
  };

  return (
    <ScrollRevealPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <ProjectDetailView project={project} relatedProjects={relatedProjects} />
    </ScrollRevealPage>
  );
}
