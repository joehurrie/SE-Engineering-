import { cookies } from "next/headers";

const AUTH_COOKIE = "se_admin_token";
const SECRET = process.env.NEXTAUTH_SECRET || "se-kenya-secure-admin-secret-key-2026";

// Simple stateless signed session token
export async function signSession(payload: { id: number; email: string; name: string; role: string }) {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const b64Data = Buffer.from(data).toString("base64url");
  const b64Sig = Buffer.from(signature).toString("base64url");
  return `${b64Data}.${b64Sig}`;
}

export async function verifySession(token: string) {
  try {
    const [b64Data, b64Sig] = token.split(".");
    if (!b64Data || !b64Sig) return null;

    const data = Buffer.from(b64Data, "base64url").toString("utf-8");
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(b64Sig, "base64url"),
      encoder.encode(data)
    );

    if (!valid) return null;

    const parsed = JSON.parse(data);
    if (parsed.exp < Date.now()) return null;

    return parsed as { id: number; email: string; name: string; role: string };
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export const ADMIN_COOKIE_NAME = AUTH_COOKIE;
