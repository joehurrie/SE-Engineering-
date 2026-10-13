import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { getCurrentAdmin } from "@/lib/auth";

// ─────────────────────────────────────────────────────────────────────────────
// Accepted MIME types (frontend mirrors this list)
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",   // non-standard alias emitted by some OS/browsers
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/avif",
  "image/heic",
  "image/heif",
];

const MAX_OUTPUT_BYTES = 10 * 1024 * 1024; // 10 MB

// ─────────────────────────────────────────────────────────────────────────────
// Determine whether a real Vercel Blob token is configured
// ─────────────────────────────────────────────────────────────────────────────
function hasBlobToken(): boolean {
  const token = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  return token.length > 0 && !token.includes("YOUR_TOKEN_HERE");
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL STORAGE (development fallback)
// Saves the optimised buffer to /public/uploads/ and returns a relative URL.
// ─────────────────────────────────────────────────────────────────────────────
async function saveLocally(buffer: Buffer, filename: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// VERCEL BLOB (production)
// ─────────────────────────────────────────────────────────────────────────────
async function saveToBlobStorage(buffer: Buffer, blobPath: string): Promise<string> {
  // Dynamic import so the module is only loaded when we actually need it,
  // avoiding a crash when the token is absent.
  const { put } = await import("@vercel/blob");
  const blob = await put(blobPath, buffer, {
    access: "public",
    contentType: "image/webp",
  });
  return blob.url;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/upload
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Normalise non-standard mime type alias
    const mimeType = file.type === "image/jpg" ? "image/jpeg" : file.type;

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: "${mimeType}". Please upload a standard image file (JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIC).` },
        { status: 415 }
      );
    }

    // ── 1. Read raw bytes ──────────────────────────────────────────────────
    const rawBuffer = Buffer.from(await file.arrayBuffer());

    // ── 2. Process with Sharp: resize + convert to WebP ───────────────────
    const optimizedBuffer = await sharp(rawBuffer)
      .resize({ width: 2560, withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer();

    // ── 3. Enforce 10 MB ceiling ───────────────────────────────────────────
    if (optimizedBuffer.length > MAX_OUTPUT_BYTES) {
      return NextResponse.json(
        { error: "Image exceeds 10 MB even after optimization. Please use a smaller source image." },
        { status: 400 }
      );
    }

    // ── 4. Build a clean filename ──────────────────────────────────────────
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")           // strip original extension
      .replace(/[^a-z0-9_-]/gi, "-")      // sanitise
      .toLowerCase()
      .slice(0, 80);                       // cap length
    const filename = `${Date.now()}-${baseName}.webp`;

    // ── 5. Choose storage backend ──────────────────────────────────────────
    let publicUrl: string;

    if (hasBlobToken()) {
      // Production: upload to Vercel Blob CDN
      publicUrl = await saveToBlobStorage(optimizedBuffer, `uploads/${filename}`);
    } else {
      // Development: write to public/uploads/ and serve statically
      publicUrl = await saveLocally(optimizedBuffer, filename);
      console.info(`[upload] Dev mode — saved locally: ${publicUrl}`);
    }

    return NextResponse.json({ url: publicUrl });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[/api/upload] Error:", message);

    // In dev, surface the real error; in prod keep it generic
    const clientMessage = process.env.NODE_ENV === "development"
      ? `Upload failed: ${message}`
      : "Image upload failed. Please try again.";

    return NextResponse.json({ error: clientMessage }, { status: 500 });
  }
}
