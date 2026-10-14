import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProjectDetailView from "@/components/ProjectDetailView";
import ScrollRevealPage from "@/components/ScrollRevealPage";
import { defaultProjects } from "@/lib/project-data";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

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
  return {
    title: project
      ? `${project.projectName} | Specialized Engineering Kenya Ltd.`
      : "Project | Specialized Engineering Kenya Ltd.",
    description: project?.description || project?.projectType,
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
    : defaultProjects.find((item) => item.id === projectId);

  if (!project) notFound();

  const relatedProjects = (dbProjects.length > 0
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

  return (
    <ScrollRevealPage>
      <ProjectDetailView project={project} relatedProjects={relatedProjects} />
    </ScrollRevealPage>
  );
}
