import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { isCareersMigrationMissing, parseVacancyInput } from "@/lib/careers";

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

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [vacancies, applications] = await Promise.all([
      prisma.jobVacancy.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    return NextResponse.json({ vacancies, applications });
  } catch (error) {
    return careersDatabaseError(error, "Failed to load careers records.");
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    const created = await prisma.jobVacancy.create({ data: vacancy });
    revalidatePath("/about");
    return NextResponse.json({ success: true, vacancy: created }, { status: 201 });
  } catch (error) {
    return careersDatabaseError(error, "Failed to create vacancy.");
  }
}
