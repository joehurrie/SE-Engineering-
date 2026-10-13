import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectName, projectType, elevatorCount, location, imageUrl, featured } = await request.json();

    if (!projectName || !projectType || !imageUrl) {
      return NextResponse.json(
        { error: "Project name, type, and image URL are required" },
        { status: 400 }
      );
    }

    const created = await prisma.project.create({
      data: {
        projectName,
        projectType,
        elevatorCount: Number(elevatorCount) || 1,
        location: location || null,
        imageUrl,
        featured: Boolean(featured),
      },
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
