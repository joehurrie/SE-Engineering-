import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { categoryToSlug } from "@/lib/slugs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.specializedengineeringltd.co.ke";

// Static elevator category slugs used in the [slug] route
const ELEVATOR_SLUGS = [
  "home-lift",
  "passenger-elevator",
  "panoramic-elevator",
  "hospital-elevator",
  "escalator-moving-walk",
  "freight-car-elevator",
  "dumbwaiter",
  "hydraulic-platform",
];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/elevators`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/lift-services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // ── Elevator category pages (static slugs) ────────────────────────────────
  const elevatorCategoryPages: MetadataRoute.Sitemap = ELEVATOR_SLUGS.map((slug) => ({
    url: `${SITE_URL}/elevators/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ── Dynamic DB pages ──────────────────────────────────────────────────────
  let elevatorProductPages: MetadataRoute.Sitemap = [];
  let newsPages: MetadataRoute.Sitemap = [];
  let projectPages: MetadataRoute.Sitemap = [];
  let sparePartPages: MetadataRoute.Sitemap = [];

  try {
    const [elevatorProducts, newsArticles, projects, spareParts] = await Promise.all([
      prisma.elevatorProduct.findMany({
        select: { id: true, category: true, title: true },
        where: { NOT: { category: { equals: "spare parts", mode: "insensitive" } } },
        orderBy: { id: "asc" },
      }),
      prisma.newsArticle.findMany({
        select: { slug: true, publishedAt: true },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.project.findMany({
        select: { id: true, createdAt: true },
        orderBy: { id: "asc" },
      }),
      prisma.sparePartProduct.findMany({
        select: { slug: true },
        orderBy: { id: "asc" },
      }),
    ]);

    // /elevators/[category-slug] for database-specific elevator categories
    const seenCategorySlugs = new Set(ELEVATOR_SLUGS);
    elevatorProducts.forEach((p) => {
      const slug = categoryToSlug(p.category);
      if (!seenCategorySlugs.has(slug)) {
        seenCategorySlugs.add(slug);
        elevatorCategoryPages.push({
          url: `${SITE_URL}/elevators/${slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.75,
        });
      }
    });

    // /elevators/product/[id]
    elevatorProductPages = elevatorProducts.map((p) => ({
      url: `${SITE_URL}/elevators/product/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    // /news/[slug]
    newsPages = newsArticles.map((a) => ({
      url: `${SITE_URL}/news/${a.slug}`,
      lastModified: a.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // /projects/[id]
    projectPages = projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // /elevators/spare-parts/[slug]
    sparePartPages = spareParts.map((s) => ({
      url: `${SITE_URL}/elevators/spare-parts/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch (err) {
    console.error("[sitemap] Failed to fetch dynamic routes from DB:", err);
  }

  return [
    ...staticPages,
    ...elevatorCategoryPages,
    ...elevatorProductPages,
    ...newsPages,
    ...projectPages,
    ...sparePartPages,
  ];
}

