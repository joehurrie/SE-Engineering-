"use client";

import { useCallback, useRef, useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, CheckCircle, AlertCircle, X, Image as ImageIcon } from "lucide-react";

interface ImageDropzoneProps {
  /** Current image URL (CDN or existing) – used to show the preview. */
  value: string;
  /** Called with the new CDN URL once upload succeeds. */
  onChange: (url: string) => void;
  /** Whether the field is required (used for native form validation fallback). */
  required?: boolean;
  /** Additional class applied to the outer container. */
  className?: string;
}

// All standard image MIME types accepted.
// NOTE: image/jpg is non-standard but emitted by some OS/browsers for .jpg files.
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",   // non-standard alias emitted by some clients
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/avif",
  "image/heic",
  "image/heif",
];

// Accept string for the <input> element (browser file picker)
const INPUT_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/avif,image/heic,image/heif";

export default function ImageDropzone({
  value,
  onChange,
  required = false,
  className = "",
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      // Client-side type guard
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload a JPEG, PNG, or WebP image.");
        return;
      }

      setError(null);
      setUploading(true);

      try {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: form });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error ?? "Upload failed.");
        }

        onChange(json.url as string);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // ── Click-to-browse handler ────────────────────────────────────────────────
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset so the same file can be re-selected if user clears and retries
    e.target.value = "";
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setError(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Hidden native file input for click-to-browse */}
      <input
        ref={inputRef}
        type="file"
        accept={INPUT_ACCEPT}
        className="sr-only"
        onChange={onFileChange}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Invisible required sentinel so native form validation still fires */}
      {required && (
        <input
          type="text"
          required
          value={value}
          readOnly
          aria-hidden="true"
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {value && !uploading ? (
        /* ── Preview ── */
        <div className="relative group h-52 rounded-none overflow-hidden border border-[#E2E8F0] bg-slate-50">
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            unoptimized
            sizes="100vw"
            className="object-cover transition duration-300 group-hover:brightness-75"
          />
          {/* Overlay controls */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition duration-200">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 text-[#0F172A] text-xs font-semibold shadow-md hover:bg-white transition"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={clearImage}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-md hover:bg-red-700 transition"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>

          {/* Success badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-600 text-white text-[10px] font-bold shadow-sm">
            <CheckCircle className="w-3 h-3" />
            Uploaded to CDN
          </div>
        </div>
      ) : (
        /* ── Drop Target ── */
        <div
          role="button"
          tabIndex={0}
          aria-label="Image drop zone — click or drag & drop to upload"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={[
            "relative flex flex-col items-center justify-center gap-3 w-full h-52 rounded-none border-2 border-dashed cursor-pointer transition-all duration-200 select-none",
            isDragging
              ? "border-blue-500 bg-blue-50 scale-[1.01] shadow-md"
              : uploading
              ? "border-blue-400 bg-blue-50/50 cursor-wait pointer-events-none"
              : "border-[#CBD5E1] bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40",
          ].join(" ")}
        >
          {uploading ? (
            /* Loading state */
            <div className="flex flex-col items-center gap-2.5 text-blue-600 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-blue-700">Processing &amp; uploading…</p>
                <p className="text-xs text-blue-500 mt-0.5">Optimizing to WebP — please wait</p>
              </div>
            </div>
          ) : isDragging ? (
            /* Drag-over state */
            <div className="flex flex-col items-center gap-2 text-blue-600 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-blue-700">Drop to upload!</p>
            </div>
          ) : (
            /* Idle state */
            <div className="flex flex-col items-center gap-2.5 text-[#94A3B8]">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-semibold text-[#475569]">
                  Drag &amp; drop image here
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  or{" "}
                  <span className="text-blue-600 font-semibold underline underline-offset-2">
                    click to browse
                  </span>
                </p>
                <p className="text-[10px] text-[#CBD5E1] mt-2 font-medium uppercase tracking-wider">
                  JPG · PNG · WebP · GIF · BMP · AVIF · HEIC · max 10 MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-none bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
