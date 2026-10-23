import { Prisma } from "@prisma/client";

export type VacancyInput = {
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string;
  published: boolean;
};

export type ApplicationInput = {
  vacancyId: number | null;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  portfolioUrl: string | null;
  message: string;
};

function requiredText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
}

function validWebUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function isCareersMigrationMissing(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError
    && (error.code === "P2021" || error.code === "P2022")
    && (error.message.includes("JobVacancy") || error.message.includes("JobApplication"));
}

export function parseVacancyInput(value: unknown): VacancyInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  const title = requiredText(data.title, 160);
  const department = requiredText(data.department, 120);
  const location = requiredText(data.location, 160);
  const employmentType = requiredText(data.employmentType, 100);
  const description = requiredText(data.description, 5000);
  const requirements = requiredText(data.requirements, 5000);

  if (
    !title ||
    !department ||
    !location ||
    !employmentType ||
    !description ||
    !requirements ||
    typeof data.published !== "boolean"
  ) {
    return null;
  }

  return { title, department, location, employmentType, description, requirements, published: data.published };
}

export function parseApplicationInput(value: unknown): ApplicationInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  const name = requiredText(data.name, 120);
  const email = requiredText(data.email, 254)?.toLowerCase();
  const phone = requiredText(data.phone, 40);
  const resumeUrl = requiredText(data.resumeUrl, 2048);
  const message = requiredText(data.message, 3000);
  const portfolioUrl =
    data.portfolioUrl === "" || data.portfolioUrl === null
      ? null
      : requiredText(data.portfolioUrl, 2048);
  const vacancyId =
    data.vacancyId === "" || data.vacancyId === null
      ? null
      : typeof data.vacancyId === "number" && Number.isSafeInteger(data.vacancyId) && data.vacancyId > 0
        ? data.vacancyId
        : null;

  if (
    !name ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !phone ||
    !resumeUrl ||
    !validWebUrl(resumeUrl) ||
    !message ||
    (data.portfolioUrl !== "" && data.portfolioUrl !== null && !portfolioUrl) ||
    (data.vacancyId !== "" && data.vacancyId !== null && vacancyId === null)
  ) {
    return null;
  }

  if (portfolioUrl && !validWebUrl(portfolioUrl)) return null;
  return { vacancyId, name, email, phone, resumeUrl, portfolioUrl, message };
}
