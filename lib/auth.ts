import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, verifySession } from "@/lib/session";

export { ADMIN_COOKIE_NAME, signSession, verifySession } from "@/lib/session";

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, name: true, role: true },
  });
  if (
    !admin ||
    admin.email.toLowerCase() !== session.email ||
    admin.role !== session.role
  ) {
    return null;
  }

  return admin;
}
