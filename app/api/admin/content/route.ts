import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

function isMissingContentJsonColumn(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError
    && error.code === "P2022"
    && error.message.includes("SiteContent.contentJson");
}

function contentDatabaseErrorResponse(error: unknown, logMessage: string, failureMessage: string) {
  if (isMissingContentJsonColumn(error)) {
    return NextResponse.json(
      {
        error: "Homepage content storage has not been migrated. Run `npx prisma migrate deploy` against this database, then retry.",
        code: "CONTENT_MIGRATION_REQUIRED",
      },
      { status: 503 }
    );
  }

  console.error(logMessage, error);
  return NextResponse.json({ error: failureMessage }, { status: 500 });
}

export async function GET() {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contents = await prisma.siteContent.findMany({
      orderBy: { sectionKey: "asc" },
    });
    return NextResponse.json({ contents });
  } catch (error) {
    return contentDatabaseErrorResponse(
      error,
      "Failed to fetch site content:",
      "Failed to load site content"
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Request body must be an object" }, { status: 400 });
  }

  const { sectionKey, title, subtitle, bodyText, imageUrl, contentJson } = body as {
    sectionKey?: unknown;
    title?: unknown;
    subtitle?: unknown;
    bodyText?: unknown;
    imageUrl?: unknown;
    contentJson?: unknown;
  };

  const isOptionalString = (value: unknown): value is string | null | undefined =>
    value === undefined || value === null || typeof value === "string";

  if (typeof sectionKey !== "string" || !sectionKey.trim()) {
    return NextResponse.json({ error: "sectionKey is required" }, { status: 400 });
  }
  if (![title, subtitle, bodyText, imageUrl].every(isOptionalString)) {
    return NextResponse.json({ error: "Content fields must be strings" }, { status: 400 });
  }

  const toOptionalString = (value: unknown): string | null | undefined =>
    typeof value === "string" || value === null ? value : undefined;
  const titleValue = toOptionalString(title);
  const subtitleValue = toOptionalString(subtitle);
  const bodyTextValue = toOptionalString(bodyText);
  const imageUrlValue = toOptionalString(imageUrl);

  let validatedContentJson: string | null = null;
  if (contentJson !== undefined && contentJson !== null && contentJson !== "") {
    if (typeof contentJson !== "string") {
      return NextResponse.json({ error: "contentJson must be a JSON string" }, { status: 400 });
    }

    try {
      const parsed: unknown = JSON.parse(contentJson);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return NextResponse.json({ error: "contentJson must contain an object" }, { status: 400 });
      }
      validatedContentJson = JSON.stringify(parsed);
    } catch {
      return NextResponse.json({ error: "contentJson must be valid JSON" }, { status: 400 });
    }
  }

  try {
    const updated = await prisma.siteContent.upsert({
      where: { sectionKey: sectionKey.trim() },
      update: {
        title: titleValue,
        subtitle: subtitleValue,
        bodyText: bodyTextValue,
        imageUrl: imageUrlValue,
        contentJson: validatedContentJson,
      },
      create: {
        sectionKey: sectionKey.trim(),
        title: titleValue,
        subtitle: subtitleValue,
        bodyText: bodyTextValue,
        imageUrl: imageUrlValue,
        contentJson: validatedContentJson,
      },
    });

    const pagePath = sectionKey.trim().startsWith("home_")
      ? "/"
      : sectionKey.trim().startsWith("about_")
        ? "/about"
        : sectionKey.trim().startsWith("projects_")
          ? "/projects"
          : sectionKey.trim().startsWith("elevators_")
            ? "/elevators"
            : sectionKey.trim().startsWith("services_")
              ? "/lift-services"
              : sectionKey.trim().startsWith("news_")
                ? "/news"
                : sectionKey.trim().startsWith("contact_")
                  ? "/contact"
                  : sectionKey.trim().startsWith("privacy_")
                    ? "/privacy"
                    : sectionKey.trim().startsWith("terms_")
                      ? "/terms"
                      : "/";
    revalidatePath(pagePath, "page");

    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    return contentDatabaseErrorResponse(
      error,
      "Failed to update site content:",
      "Failed to update content"
    );
  }
}
