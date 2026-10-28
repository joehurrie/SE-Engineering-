import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { defaultArticles } from "@/lib/news-data";

export async function GET() {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let articles = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: "desc" },
    });

    // If database table is empty, seed with the default articles so admin can manage them immediately
    if (articles.length === 0 && defaultArticles.length > 0) {
      try {
        await prisma.newsArticle.createMany({
          data: defaultArticles.map((a) => ({
            title: a.title,
            slug: a.slug,
            excerpt: a.excerpt,
            content: a.content,
            imageUrl: a.img,
            category: a.category,
            featured: a.featured,
            publishedAt: new Date(a.publishedAt),
          })),
          skipDuplicates: true,
        });
        articles = await prisma.newsArticle.findMany({
          orderBy: { publishedAt: "desc" },
        });
      } catch (seedErr) {
        console.warn("Could not seed default articles:", seedErr);
      }
    }

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
    const { title, slug, content, excerpt, imageUrl, category, featured, publishedAt } =
      await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const generatedSlug =
      (slug && slug.trim().length > 0
        ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        : title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")) + `-${Date.now().toString().slice(-4)}`;

    const computedExcerpt =
      excerpt && excerpt.trim().length > 0
        ? excerpt.trim()
        : content.length > 180
          ? `${content.slice(0, 180)}...`
          : content;

    const created = await prisma.newsArticle.create({
      data: {
        title: title.trim(),
        slug: generatedSlug,
        content: content.trim(),
        excerpt: computedExcerpt,
        imageUrl: imageUrl || null,
        category: (category && category.trim()) || "Engineering News",
        featured: featured === true,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    });

    try {
      revalidatePath("/news", "page");
      revalidatePath("/", "page");
    } catch {}

    return NextResponse.json({ success: true, article: created }, { status: 201 });
  } catch (error) {
    console.error("Create news error:", error);
    return NextResponse.json({ error: "Failed to create news article" }, { status: 500 });
  }
}
