import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const products = await prisma.elevatorProduct.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Elevator fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch elevator products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { category, title, description, specifications, imageUrl, featured } = data;

    if (!category || !title || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Category, title, description, and image URL are required" },
        { status: 400 }
      );
    }

    const created = await prisma.elevatorProduct.create({
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

    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error) {
    console.error("Create elevator error:", error);
    return NextResponse.json({ error: "Failed to create elevator product" }, { status: 500 });
  }
}
