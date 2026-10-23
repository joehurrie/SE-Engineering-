import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany({
      where: { sectionKey: { startsWith: "contact_" } },
      orderBy: { sectionKey: "asc" },
    });
    return NextResponse.json({ contents });
  } catch (error) {
    console.error("Failed to fetch public contact content:", error);
    return NextResponse.json({ error: "Failed to load contact page content" }, { status: 500 });
  }
}
