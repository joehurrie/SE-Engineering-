import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendInquiryNotificationEmail } from "@/lib/mailer";

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

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedPhone = phone ? String(phone).trim() : null;
    const trimmedSubject = subject ? String(subject).trim() : "General Inquiry";
    const trimmedMessage = String(message).trim();

    // 1. Endpoint A: Store inquiry in CMS Database (Prisma)
    const inquiry = await prisma.inquiry.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        subject: trimmedSubject,
        message: trimmedMessage,
        read: false,
      },
    });

    // 2. Endpoint B: Dispatch notification via Nodemailer
    // Runs concurrently and logs delivery status without blocking client response
    try {
      await sendInquiryNotificationEmail({
        id: inquiry.id,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        subject: trimmedSubject,
        message: trimmedMessage,
        createdAt: inquiry.createdAt,
      });
    } catch (emailErr) {
      console.error("[Inquiry API] Email dispatch error:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry received and recorded successfully.",
        id: inquiry.id,
      },
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
