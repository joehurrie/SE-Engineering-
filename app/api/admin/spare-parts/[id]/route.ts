import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { parseSparePartInput, sparePartSlug } from "@/lib/spare-part-input";

type SparePartRouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: SparePartRouteContext) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id < 1) {
      return NextResponse.json({ error: "Invalid spare part ID" }, { status: 400 });
    }

    const parsed = parseSparePartInput(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const baseSlug = sparePartSlug(parsed.data.title);
    let slug = baseSlug;
    let suffix = 2;
    while (await prisma.sparePartProduct.findFirst({
      where: { slug, id: { not: id } },
      select: { id: true },
    })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const sparePart = await prisma.sparePartProduct.update({
      where: { id },
      data: { ...parsed.data, slug },
    });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, sparePart });
  } catch (error) {
    console.error("Update spare part error:", error);
    return NextResponse.json({ error: "Failed to update spare part" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: SparePartRouteContext) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id < 1) {
      return NextResponse.json({ error: "Invalid spare part ID" }, { status: 400 });
    }

    await prisma.sparePartProduct.delete({ where: { id } });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete spare part error:", error);
    return NextResponse.json({ error: "Failed to delete spare part" }, { status: 500 });
  }
}
