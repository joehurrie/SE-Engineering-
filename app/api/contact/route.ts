import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendInquiryNotificationEmail } from "@/lib/mailer";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates and sanitizes phone numbers.
 * Supports standard international formats (E.164) and local phone formats (7 to 15 digits).
 */
function validateAndSanitizePhone(phoneInput: unknown): {
  valid: boolean;
  phone: string | null;
  error?: string;
} {
  if (phoneInput === undefined || phoneInput === null) {
    return { valid: true, phone: null };
  }

  const str = String(phoneInput).trim();
  if (!str) {
    return { valid: true, phone: null };
  }

  // Remove valid formatting characters: spaces, hyphens, parentheses, dots
  const stripped = str.replace(/[\s\-\(\)\.]/g, "");

  // Must consist of optional leading '+' and 7 to 15 digits
  const isValid = /^\+?[0-9]{7,15}$/.test(stripped);
  if (!isValid) {
    return {
      valid: false,
      phone: null,
      error: "Please enter a valid phone number with 7 to 15 digits (e.g. +254 700 000 000).",
    };
  }

  // Normalize duplicate spaces
  const sanitized = str.replace(/\s+/g, " ");
  return { valid: true, phone: sanitized };
}

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
    const trimmedSubject = subject ? String(subject).trim() : "General Inquiry";
    const trimmedMessage = String(message).trim();

    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Phone number data type and format validation
    const phoneValidation = validateAndSanitizePhone(phone);
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { error: phoneValidation.error },
        { status: 400 }
      );
    }
    const validatedPhone = phoneValidation.phone;

    // 1. Endpoint A: Store inquiry in CMS Database (Prisma)
    const inquiry = await prisma.inquiry.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        phone: validatedPhone,
        subject: trimmedSubject,
        message: trimmedMessage,
        read: false,
      },
    });

    // 2. Endpoint B: Dispatch notification via Nodemailer
    try {
      await sendInquiryNotificationEmail({
        id: inquiry.id,
        name: trimmedName,
        email: trimmedEmail,
        phone: validatedPhone,
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
