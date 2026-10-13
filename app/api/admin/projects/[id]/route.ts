import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    const { projectName, projectType, elevatorCount, location, imageUrl, featured } = await request.json();

    const updated = await prisma.project.update({
      where: { id: numId },
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

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const numId = parseInt(id, 10);

    await prisma.project.delete({
      where: { id: numId },
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
