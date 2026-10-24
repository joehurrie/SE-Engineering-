import { NextResponse } from "next/server";
import { getFooterSettings } from "@/lib/footer-content";

export async function GET() {
  try {
    const footer = await getFooterSettings();
    return NextResponse.json(footer);
  } catch (error) {
    console.error("Failed to load footer settings:", error);
    return NextResponse.json(
      { error: "Failed to load footer settings" },
      { status: 500 }
    );
  }
}
