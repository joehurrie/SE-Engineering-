import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signSession, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    const { email, password } = body as { email?: unknown; password?: unknown };

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    if (admin.role !== "SUPER_ADMIN" && admin.role !== "EDITOR") {
      return NextResponse.json({ error: "Administrator role is not permitted." }, { status: 403 });
    }

    const token = await signSession({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
