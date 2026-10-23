import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isCareersMigrationMissing, parseApplicationInput } from "@/lib/careers";

const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Application is too large." }, { status: 413 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch (error) {
    console.error("Failed to read career application:", error);
    return NextResponse.json({ error: "Could not read application." }, { status: 400 });
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Application is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof (body as Record<string, unknown>).consent !== "boolean" ||
    (body as Record<string, unknown>).consent !== true ||
    typeof (body as Record<string, unknown>).website !== "string" ||
    (body as Record<string, unknown>).website !== ""
  ) {
    return NextResponse.json({ error: "Please complete the application form." }, { status: 400 });
  }

  const application = parseApplicationInput(body);
  if (!application) {
    return NextResponse.json(
      { error: "Check your contact details, message, and HTTPS resume or portfolio links." },
      { status: 400 }
    );
  }

  try {
    const vacancy = application.vacancyId
      ? await prisma.jobVacancy.findFirst({
          where: { id: application.vacancyId, published: true },
          select: { id: true, title: true },
        })
      : null;
    const hasPublishedVacancies = application.vacancyId
      ? true
      : (await prisma.jobVacancy.count({ where: { published: true } })) > 0;

    if (application.vacancyId && !vacancy) {
      return NextResponse.json({ error: "That opportunity is no longer available." }, { status: 400 });
    }
    if (!hasPublishedVacancies) {
      return NextResponse.json({ error: "There are no open opportunities to apply for." }, { status: 400 });
    }

    const created = await prisma.jobApplication.create({
      data: {
        ...application,
        vacancyTitle: vacancy?.title || "General application",
      },
      select: { id: true },
    });

    return NextResponse.json(
      { success: true, message: "Application received. Thank you for your interest.", id: created.id },
      { status: 201 }
    );
  } catch (error) {
    if (isCareersMigrationMissing(error)) {
      return NextResponse.json(
        { error: "Career application storage is not available yet. Please try again later." },
        { status: 503 }
      );
    }
    console.error("Failed to save career application:", error);
    return NextResponse.json(
      { error: "We could not save your application. Please try again later." },
      { status: 500 }
    );
  }
}
