export function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (
    !secret ||
    secret.length < 32 ||
    /se-kenya|admin-secret|replace-with|change-me|example|placeholder/i.test(secret)
  ) {
    throw new Error(
      "NEXTAUTH_SECRET must be a unique secret of at least 32 characters. Generate one with `openssl rand -base64 48`."
    );
  }
  return secret;
}

export function validateServerEnvironment(): void {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL connection URL.");
  }

  if (!['postgres:', 'postgresql:'].includes(parsedUrl.protocol)) {
    throw new Error("DATABASE_URL must use the postgres or postgresql protocol.");
  }
  if (
    parsedUrl.hostname.toLowerCase() === "host" ||
    parsedUrl.username.toLowerCase() === "user" ||
    parsedUrl.password.toLowerCase() === "password" ||
    parsedUrl.pathname.toLowerCase() === "/database"
  ) {
    throw new Error("DATABASE_URL still contains sample placeholder values.");
  }

  getAuthSecret();
}