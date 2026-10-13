import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Fetch news error:", error);
    return NextResponse.json({ error: "Failed to fetch news articles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, slug, content, imageUrl } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const generatedSlug =
      (slug && slug.trim().length > 0
        ? slug
        : title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")) + `-${Date.now().toString().slice(-4)}`;

    const created = await prisma.newsArticle.create({
      data: {
        title,
        slug: generatedSlug,
        content,
        imageUrl: imageUrl || null,
      },
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true, article: created }, { status: 201 });
  } catch (error) {
    console.error("Create news error:", error);
    return NextResponse.json({ error: "Failed to create news article" }, { status: 500 });
  }
}
