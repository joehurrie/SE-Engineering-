import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { categoryToSlug } from "@/lib/slugs";
import { defaultArticles } from "@/lib/news-data";
import { defaultProjects } from "@/lib/project-data";
import { defaultSpareParts } from "@/lib/default-spare-parts";

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
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ── Elevator category pages (static slugs) ────────────────────────────────
  const elevatorCategoryPages: MetadataRoute.Sitemap = ELEVATOR_SLUGS.map((slug) => ({
    url: `${SITE_URL}/elevators/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
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
          priority: 0.8,
        });
      }
    });

    // /elevators/product/[id]
    elevatorProductPages = elevatorProducts.map((p) => ({
      url: `${SITE_URL}/elevators/product/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

    // /news/[slug] — DB articles + default fallback articles
    const seenNewsSlugs = new Set<string>();
    newsPages = newsArticles.map((a) => {
      seenNewsSlugs.add(a.slug);
      return {
        url: `${SITE_URL}/news/${a.slug}`,
        lastModified: a.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });
    defaultArticles.forEach((a) => {
      if (!seenNewsSlugs.has(a.slug)) {
        seenNewsSlugs.add(a.slug);
        newsPages.push({
          url: `${SITE_URL}/news/${a.slug}`,
          lastModified: new Date(a.publishedAt || now),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        });
      }
    });

    // /projects/[id] — DB projects + default fallback projects
    const seenProjectIds = new Set<number>();
    projectPages = projects.map((p) => {
      seenProjectIds.add(p.id);
      return {
        url: `${SITE_URL}/projects/${p.id}`,
        lastModified: p.createdAt || now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });
    defaultProjects.forEach((p) => {
      if (!seenProjectIds.has(p.id)) {
        seenProjectIds.add(p.id);
        projectPages.push({
          url: `${SITE_URL}/projects/${p.id}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        });
      }
    });

    // /elevators/spare-parts/[slug] — DB parts + default fallback parts
    const seenSpareSlugs = new Set<string>();
    sparePartPages = spareParts.map((s) => {
      seenSpareSlugs.add(s.slug);
      return {
        url: `${SITE_URL}/elevators/spare-parts/${s.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });
    defaultSpareParts.forEach((s) => {
      if (!seenSpareSlugs.has(s.slug)) {
        seenSpareSlugs.add(s.slug);
        sparePartPages.push({
          url: `${SITE_URL}/elevators/spare-parts/${s.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        });
      }
    });
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
