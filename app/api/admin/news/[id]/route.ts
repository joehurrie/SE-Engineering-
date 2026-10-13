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
    const { title, slug, content, imageUrl } = await request.json();

    const updated = await prisma.newsArticle.update({
      where: { id: numId },
      data: {
        title,
        slug,
        content,
        imageUrl: imageUrl || null,
      },
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    console.error("Update news error:", error);
    return NextResponse.json({ error: "Failed to update news article" }, { status: 500 });
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

    await prisma.newsArticle.delete({
      where: { id: numId },
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete news error:", error);
    return NextResponse.json({ error: "Failed to delete news article" }, { status: 500 });
  }
}
