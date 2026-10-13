import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { parseSparePartInput, sparePartSlug } from "@/lib/spare-part-input";

export async function GET() {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const spareParts = await prisma.sparePartProduct.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json({ spareParts });
  } catch (error) {
    console.error("Spare part fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch spare parts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = parseSparePartInput(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const baseSlug = sparePartSlug(parsed.data.title);
    let slug = baseSlug;
    let suffix = 2;
    while (await prisma.sparePartProduct.findUnique({ where: { slug }, select: { id: true } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const sparePart = await prisma.sparePartProduct.create({
      data: { ...parsed.data, slug },
    });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, sparePart }, { status: 201 });
  } catch (error) {
    console.error("Create spare part error:", error);
    return NextResponse.json({ error: "Failed to create spare part" }, { status: 500 });
  }
}
