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
    const data = await request.json();
    const { category, title, description, specifications, imageUrl, featured } = data;

    const updated = await prisma.elevatorProduct.update({
      where: { id: numId },
      data: {
        category,
        title,
        description,
        specifications: typeof specifications === "object" ? JSON.stringify(specifications) : specifications,
        imageUrl,
        featured: Boolean(featured),
      },
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update elevator error:", error);
    return NextResponse.json({ error: "Failed to update elevator product" }, { status: 500 });
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

    await prisma.elevatorProduct.delete({
      where: { id: numId },
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete elevator error:", error);
    return NextResponse.json({ error: "Failed to delete elevator product" }, { status: 500 });
  }
}
