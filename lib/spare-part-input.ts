export type SparePartInput = {
  slug: string;
  title: string;
  description: string;
  specifications: string | null;
  imageUrl: string;
  galleryImages: string[];
  featured: boolean;
};

export function sparePartSlug(title: string): string {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "spare-part";
}

export function parseSparePartInput(
  input: unknown,
): { success: true; data: Omit<SparePartInput, "slug"> } | { success: false; error: string } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { success: false, error: "Spare part data must be an object" };
  }

  const value = input as Record<string, unknown>;
  for (const field of ["title", "description", "imageUrl"] as const) {
    if (typeof value[field] !== "string" || !value[field].trim()) {
      return { success: false, error: `${field} is required` };
    }
  }

  if (value.galleryImages !== undefined && !Array.isArray(value.galleryImages)) {
    return { success: false, error: "galleryImages must be an array of image URLs" };
  }

  const imageUrl = (value.imageUrl as string).trim();
  const galleryImages = Array.isArray(value.galleryImages)
    ? value.galleryImages.filter(
        (image): image is string => typeof image === "string" && image.trim().length > 0,
      )
    : [];
  const specifications =
    typeof value.specifications === "string"
      ? value.specifications.trim() || null
      : value.specifications && typeof value.specifications === "object"
        ? JSON.stringify(value.specifications)
        : null;

  return {
    success: true,
    data: {
      title: (value.title as string).trim(),
      description: (value.description as string).trim(),
      specifications,
      imageUrl,
      galleryImages: Array.from(new Set([imageUrl, ...galleryImages])),
      featured: value.featured === true,
    },
  };
}
