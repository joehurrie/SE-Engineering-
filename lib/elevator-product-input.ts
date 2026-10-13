export type ElevatorProductInput = {
  category: string;
  title: string;
  description: string;
  specifications: string | null;
  imageUrl: string;
  galleryImages: string[];
  featured: boolean;
};

export function parseElevatorProductInput(
  input: unknown,
): { success: true; data: ElevatorProductInput } | { success: false; error: string } {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { success: false, error: "Product data must be an object" };
  }

  const value = input as Record<string, unknown>;
  const requiredFields = ["category", "title", "description", "imageUrl"] as const;
  for (const field of requiredFields) {
    if (typeof value[field] !== "string" || !value[field].trim()) {
      return { success: false, error: `${field} is required` };
    }
  }

  if (value.galleryImages !== undefined && !Array.isArray(value.galleryImages)) {
    return { success: false, error: "galleryImages must be an array of image URLs" };
  }

  const galleryImages = Array.isArray(value.galleryImages)
    ? value.galleryImages.filter(
        (image): image is string => typeof image === "string" && image.trim().length > 0,
      )
    : [];
  const imageUrl = (value.imageUrl as string).trim();
  const specifications =
    typeof value.specifications === "string"
      ? value.specifications
      : value.specifications && typeof value.specifications === "object"
        ? JSON.stringify(value.specifications)
        : null;

  return {
    success: true,
    data: {
      category: (value.category as string).trim(),
      title: (value.title as string).trim(),
      description: (value.description as string).trim(),
      specifications,
      imageUrl,
      galleryImages: Array.from(new Set([imageUrl, ...galleryImages])),
      featured: value.featured === true,
    },
  };
}
