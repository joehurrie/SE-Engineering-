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
    const services = await prisma.liftService.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error) {
    console.error("Fetch services error:", error);
    return NextResponse.json({ error: "Failed to fetch lift services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { category, title, description, imageUrl } = await request.json();

    if (!category || !title || !description) {
      return NextResponse.json(
        { error: "Category, title, and description are required" },
        { status: 400 }
      );
    }

    const created = await prisma.liftService.create({
      data: {
        category,
        title,
        description,
        imageUrl: imageUrl || null,
      },
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true, service: created }, { status: 201 });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Failed to create lift service" }, { status: 500 });
  }
}
