import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany({
      orderBy: { sectionKey: "asc" },
    });
    return NextResponse.json({ contents });
  } catch (error) {
    console.error("Failed to fetch site content:", error);
    return NextResponse.json({ error: "Failed to load site content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sectionKey, title, subtitle, bodyText, imageUrl } = await request.json();

    if (!sectionKey) {
      return NextResponse.json({ error: "sectionKey is required" }, { status: 400 });
    }

    const updated = await prisma.siteContent.upsert({
      where: { sectionKey },
      update: {
        title,
        subtitle,
        bodyText,
        imageUrl,
      },
      create: {
        sectionKey,
        title,
        subtitle,
        bodyText,
        imageUrl,
      },
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error("Failed to update site content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
