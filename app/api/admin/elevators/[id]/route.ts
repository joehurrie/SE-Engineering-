import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { parseElevatorProductInput } from "@/lib/elevator-product-input";

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
    if (!Number.isInteger(numId) || numId < 1) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }
    const parsed = parseElevatorProductInput(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    if (parsed.data.category.toLowerCase() === "spare parts") {
      return NextResponse.json(
        { error: "Spare parts are managed through the dedicated spare-parts catalog." },
        { status: 400 }
      );
    }

    const updated = await prisma.elevatorProduct.update({
      where: { id: numId },
      data: parsed.data,
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update elevator error:", error);
    return NextResponse.json({ error: "Failed to update elevator product" }, { status: 500 });
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

    await prisma.elevatorProduct.delete({
      where: { id: numId },
    });

    try {
      revalidatePath("/", "layout");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete elevator error:", error);
    return NextResponse.json({ error: "Failed to delete elevator product" }, { status: 500 });
  }
}
