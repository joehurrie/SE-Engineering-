import { getAuthSecret } from "@/lib/env";

const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
export const ADMIN_COOKIE_NAME = "se_admin_token";

export type AdminSession = {
  id: number;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "EDITOR";
  exp: number;
};

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string): ArrayBuffer {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}

function sessionKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signSession(
  admin: Omit<AdminSession, "exp">
): Promise<string> {
  const payload: AdminSession = {
    ...admin,
    email: admin.email.trim().toLowerCase(),
    exp: Date.now() + SESSION_LIFETIME_MS,
  };
  const encodedPayload = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await sessionKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(encodedPayload)
  );
  return `${encodedPayload}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    if (token.length > 4096) return null;
    const parts = token.split(".");
    if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
    const [encodedPayload, encodedSignature] = parts;
    const key = await sessionKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(encodedPayload)
    );
    if (!valid) return null;

    const parsed: unknown = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(encodedPayload))
    );
    if (!parsed || typeof parsed !== "object") return null;

    const session = parsed as Partial<AdminSession>;
    if (
      !Number.isInteger(session.id) ||
      (session.id ?? 0) < 1 ||
      typeof session.email !== "string" ||
      !session.email.includes("@") ||
      typeof session.name !== "string" ||
      !["SUPER_ADMIN", "EDITOR"].includes(session.role ?? "") ||
      !Number.isFinite(session.exp) ||
      (session.exp ?? 0) <= Date.now()
    ) {
      return null;
    }

    return session as AdminSession;
  } catch {
    return null;
  }
}