import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      productsCount,
      servicesCount,
      projectsCount,
      inquiriesCount,
      unreadInquiriesCount,
      recentInquiries,
    ] = await Promise.all([
      prisma.elevatorProduct.count(),
      prisma.liftService.count(),
      prisma.project.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { read: false } }),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      productsCount,
      servicesCount,
      projectsCount,
      inquiriesCount,
      unreadInquiriesCount,
      recentInquiries,
    });
  } catch (error) {
    console.error("Failed to load admin stats:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard statistics" },
      { status: 500 }
    );
  }
}
