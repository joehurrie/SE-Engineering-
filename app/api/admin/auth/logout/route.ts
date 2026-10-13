import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getCurrentAdmin } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

export async function GET() {
  const user = await getCurrentAdmin();
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}
