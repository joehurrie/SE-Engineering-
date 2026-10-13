export type ProjectInput = {
  projectName: string;
  projectType: string;
  description: string;
  elevatorCount: number;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string;
  galleryImages: string[];
  status: string;
  featured: boolean;
};

export function parseProjectInput(value: unknown): ProjectInput | { error: string } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { error: "Project details must be provided as an object." };
  }

  const input = value as Record<string, unknown>;
  const projectName = typeof input.projectName === "string" ? input.projectName.trim() : "";
  const projectType = typeof input.projectType === "string" ? input.projectType.trim() : "";
  const imageUrl = typeof input.imageUrl === "string" ? input.imageUrl.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const location = typeof input.location === "string" ? input.location.trim() : "";
  const elevatorCount = Number(input.elevatorCount);
  const status = input.status === undefined ? "COMMISSIONED" : input.status;

  if (!projectName || !projectType || !imageUrl) {
    return { error: "Project name, elevator type, and cover image are required." };
  }
  if (!Number.isInteger(elevatorCount) || elevatorCount < 1) {
    return { error: "Elevator count must be a positive whole number." };
  }
  if (status !== "ACTIVE" && status !== "COMMISSIONED") {
    return { error: "Project status must be Active or Commissioned." };
  }
  if (input.galleryImages !== undefined && !Array.isArray(input.galleryImages)) {
    return { error: "Project gallery must be a list of image URLs." };
  }
  if (Array.isArray(input.galleryImages) && !input.galleryImages.every((image) => typeof image === "string")) {
    return { error: "Each gallery image must have a valid URL." };
  }

  const galleryImages = Array.isArray(input.galleryImages)
    ? input.galleryImages.map((image) => image.trim()).filter(Boolean)
    : [];

  const latitude = input.latitude === null || input.latitude === undefined || input.latitude === ""
    ? null
    : Number(input.latitude);
  const longitude = input.longitude === null || input.longitude === undefined || input.longitude === ""
    ? null
    : Number(input.longitude);

  if ((latitude === null) !== (longitude === null)) {
    return { error: "Provide both latitude and longitude to place this project on the map." };
  }
  if (
    (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) ||
    (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))
  ) {
    return { error: "Project coordinates are outside the valid latitude or longitude range." };
  }

  return {
    projectName,
    projectType,
    description,
    elevatorCount,
    location: location || null,
    latitude,
    longitude,
    imageUrl,
    galleryImages,
    status,
    featured: input.featured === true,
  };
}
