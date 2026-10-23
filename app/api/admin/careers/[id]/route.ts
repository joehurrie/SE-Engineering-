import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { isCareersMigrationMissing, parseVacancyInput } from "@/lib/careers";

type RouteContext = { params: Promise<{ id: string }> };

function careersDatabaseError(error: unknown, fallback: string) {
  if (isCareersMigrationMissing(error)) {
    return NextResponse.json(
      { error: "Careers storage is not migrated. Run `npx prisma migrate deploy` against this database.", code: "CAREERS_MIGRATION_REQUIRED" },
      { status: 503 }
    );
  }
  console.error(fallback, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid vacancy id." }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const vacancy = parseVacancyInput(body);
  if (!vacancy) {
    return NextResponse.json({ error: "Complete all vacancy fields with valid values." }, { status: 400 });
  }

  try {
    const updated = await prisma.jobVacancy.update({ where: { id }, data: vacancy });
    revalidatePath("/about");
    return NextResponse.json({ success: true, vacancy: updated });
  } catch (error) {
    return careersDatabaseError(error, "Failed to update vacancy.");
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid vacancy id." }, { status: 400 });

  try {
    await prisma.jobVacancy.delete({ where: { id } });
    revalidatePath("/about");
    return NextResponse.json({ success: true });
  } catch (error) {
    return careersDatabaseError(error, "Failed to delete vacancy.");
  }
}
