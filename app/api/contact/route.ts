import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : null,
        subject: subject ? String(subject).trim() : "General Inquiry",
        message: String(message).trim(),
        read: false,
      },
    });

    return NextResponse.json(
      { success: true, message: "Inquiry received successfully.", id: inquiry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting your message." },
      { status: 500 }
    );
  }
}
