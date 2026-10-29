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
    if (!Number.isInteger(numId)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, slug, content, excerpt, imageUrl, category, featured, publishedAt } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const computedExcerpt =
      excerpt && excerpt.trim().length > 0
        ? excerpt.trim()
        : content.length > 180
          ? `${content.slice(0, 180)}...`
          : content;

    let parsedDate: Date | undefined = undefined;
    if (publishedAt) {
      const d = new Date(publishedAt);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      }
    }

    const updated = await prisma.newsArticle.update({
      where: { id: numId },
      data: {
        title: title.trim(),
        slug: slug?.trim() || undefined,
        content: content.trim(),
        excerpt: computedExcerpt,
        imageUrl: imageUrl || null,
        category: (category && category.trim()) || "Engineering News",
        featured: featured === true,
        publishedAt: parsedDate,
      },
    });

    try {
      revalidatePath("/news", "page");
      revalidatePath(`/news/${updated.slug}`, "page");
      revalidatePath("/", "page");
    } catch {}

    return NextResponse.json({ success: true, article: updated });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string; meta?: unknown; stack?: string } | null;
    console.error("Update news error:", error);
    return NextResponse.json(
      {
        error: err?.message || "Failed to update news article",
        code: err?.code,
        meta: err?.meta,
        stack: err?.stack,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    if (!Number.isInteger(numId)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
    }

    const body = await request.json();
    const dataToUpdate: Record<string, unknown> = {};

    if (typeof body.featured === "boolean") {
      dataToUpdate.featured = body.featured;
    }
    if (typeof body.title === "string") {
      dataToUpdate.title = body.title.trim();
    }
    if (typeof body.category === "string") {
      dataToUpdate.category = body.category.trim();
    }
    if (body.publishedAt) {
      const d = new Date(body.publishedAt);
      if (!isNaN(d.getTime())) {
        dataToUpdate.publishedAt = d;
      }
    }

    const updated = await prisma.newsArticle.update({
      where: { id: numId },
      data: dataToUpdate,
    });

    try {
      revalidatePath("/news", "page");
      revalidatePath(`/news/${updated.slug}`, "page");
      revalidatePath("/", "page");
    } catch {}

    return NextResponse.json({ success: true, article: updated });
  } catch (error: unknown) {
    const err = error as { message?: string } | null;
    console.error("Patch news error:", error);
    return NextResponse.json(
      { error: err?.message || "Failed to update article status" },
      { status: 500 }
    );
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
    if (!Number.isInteger(numId)) {
      return NextResponse.json({ error: "Invalid article ID" }, { status: 400 });
    }

    const deleted = await prisma.newsArticle.delete({
      where: { id: numId },
    });

    try {
      revalidatePath("/news", "page");
      revalidatePath(`/news/${deleted.slug}`, "page");
      revalidatePath("/", "page");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { message?: string } | null;
    console.error("Delete news error:", error);
    return NextResponse.json(
      { error: err?.message || "Failed to delete news article" },
      { status: 500 }
    );
  }
}
