import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { parseElevatorProductInput } from "@/lib/elevator-product-input";

export async function GET() {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allProducts = await prisma.elevatorProduct.findMany({
      orderBy: { id: "asc" },
    });
    const products = allProducts.filter(
      (product) => product.category.trim().toLowerCase() !== "spare parts",
    );
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
    const parsed = parseElevatorProductInput(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    if (parsed.data.category.toLowerCase() === "spare parts") {
      return NextResponse.json(
        { error: "Create spare parts through the dedicated spare-parts catalog." },
        { status: 400 }
      );
    }

    const created = await prisma.elevatorProduct.create({
      data: parsed.data,
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
