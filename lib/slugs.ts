export function categoryToSlug(category: string): string {
  const map: Record<string, string> = {
    "Home Lift": "home-lift",
    "Passenger Elevator": "passenger-elevator",
    "Escalator & Moving Walk": "escalator-moving-walk",
    "Panoramic Elevator": "panoramic-elevator",
    "Hospital Elevator": "hospital-elevator",
    "Freight Elevator & Car Elevator": "freight-car-elevator",
    "Dumbwaiter": "dumbwaiter",
    "Hydraulic Platform": "hydraulic-platform",
  };
  return (
    map[category] ||
    category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  );
}

export function slugToCategory(slug: string): string {
  const map: Record<string, string> = {
    "home-lift": "Home Lift",
    "passenger-elevator": "Passenger Elevator",
    "escalator-moving-walk": "Escalator & Moving Walk",
    "panoramic-elevator": "Panoramic Elevator",
    "hospital-elevator": "Hospital Elevator",
    "freight-car-elevator": "Freight Elevator & Car Elevator",
    "dumbwaiter": "Dumbwaiter",
    "hydraulic-platform": "Hydraulic Platform",
  };
  return map[slug] || slug.replace(/-/g, " ");
}
