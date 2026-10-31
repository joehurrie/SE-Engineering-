import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import prisma from "@/lib/prisma";
import ScrollRevealPage from "@/components/ScrollRevealPage";
import { defaultArticles, type NewsArticleContent } from "@/lib/news-data";

export const dynamic = "force-dynamic";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

type DbNewsItem = {
  id: number;
  slug: string;
  title: string;
  content: string;
  imageUrl: string | null;
  publishedAt: Date;
  excerpt?: string | null;
  category?: string | null;
  featured?: boolean | null;
};

async function getArticle(slug: string): Promise<NewsArticleContent | null> {
  const dbArticle = await prisma.newsArticle.findUnique({ where: { slug } });
  if (dbArticle) {
    const item = dbArticle as unknown as DbNewsItem;
    return {
      slug: item.slug,
      title: item.title,
      excerpt:
        item.excerpt && item.excerpt.trim().length > 0
          ? item.excerpt.trim()
          : item.content.length > 180
            ? `${item.content.slice(0, 180)}...`
            : item.content,
      content: item.content,
      publishedAt: item.publishedAt.toISOString().split("T")[0],
      category: item.category || "Engineering News",
      img:
        item.imageUrl ||
        "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1200",
      featured: Boolean(item.featured),
    };
  }

  const sample = defaultArticles.find((article) => article.slug === slug);
  if (sample) return sample;

  return null;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.specializedengineeringltd.co.ke";

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return { title: "Story | Specialized Engineering Kenya Ltd." };

  const ogImage = article.img || `${SITE_URL}/og-image.jpeg`;

  return {
    title: `${article.title} | Specialized Engineering Kenya Ltd.`,
    description: article.excerpt,
    keywords: [
      article.category || "Engineering News",
      "elevator news Kenya",
      "lift industry insights",
      "Specialized Engineering",
    ],
    alternates: { canonical: `${SITE_URL}/news/${slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/news/${slug}`,
      title: article.title,
      description: article.excerpt || "",
      publishedTime: article.publishedAt,
      authors: ["Specialized Engineering Kenya Ltd."],
      section: article.category || "Engineering",
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || "",
      images: [ogImage],
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  let relatedArticles: NewsArticleContent[] = [];
  try {
    const databaseStories = await prisma.newsArticle.findMany({
      where: { slug: { not: article.slug } },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
    if (databaseStories.length > 0) {
      relatedArticles = (databaseStories as unknown as DbNewsItem[]).map((item) => ({
        slug: item.slug,
        title: item.title,
        excerpt:
          item.excerpt && item.excerpt.trim().length > 0
            ? item.excerpt.trim()
            : item.content.length > 180
              ? `${item.content.slice(0, 180)}...`
              : item.content,
        content: item.content,
        publishedAt: item.publishedAt.toISOString().split("T")[0],
        category: item.category || "Engineering News",
        img:
          item.imageUrl ||
          "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1200",
        featured: Boolean(item.featured),
      }));
    }
  } catch (error) {
    console.error("Failed to load related stories:", error);
  }

  if (relatedArticles.length === 0) {
    relatedArticles = defaultArticles
      .filter((item) => item.slug !== article.slug)
      .sort((left, right) => Number(right.category === article.category) - Number(left.category === article.category))
      .slice(0, 3);
  }

  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.img || `${SITE_URL}/og-image.jpeg`],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: [
      {
        "@type": "Organization",
        name: "Specialized Engineering Kenya Ltd.",
        url: SITE_URL,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "Specialized Engineering Kenya Ltd.",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/news/${slug}`,
    },
  };

  return (
    <ScrollRevealPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="min-h-screen bg-white text-neutral-900">
        <header className="relative flex min-h-[70vh] items-end overflow-hidden bg-[#F5F5F3] px-6 py-32 text-white">
          <Image
            src={article.img}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 mx-auto w-full max-w-5xl">
            <Link
              href="/news"
              className="mb-10 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white drop-shadow-lg transition-colors hover:text-blue-300"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              All news &amp; insights
            </Link>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-2 text-xs text-white/80">
                <Calendar aria-hidden="true" className="h-4 w-4 text-blue-300" />
                {new Date(article.publishedAt).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {article.featured && (
                <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] border border-white/30">
                  Featured Story
                </span>
              )}
            </div>
            <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight drop-shadow-lg sm:text-4xl md:text-6xl">
              {article.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white drop-shadow-lg md:text-lg">
              {article.excerpt}
            </p>
          </div>
        </header>

        <article className="px-6 py-16 md:py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
            <div className="mx-auto w-full max-w-3xl">
              <div className="mb-8 h-1 w-16 bg-blue-600" />
              <div className="space-y-6 text-base leading-8 text-neutral-700 md:text-lg md:leading-9 whitespace-pre-line">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-12 border-t border-neutral-200 pt-6">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700 transition-colors hover:text-blue-700"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Back to all stories
                </Link>
              </div>
            </div>

            <aside className="h-fit border border-neutral-200 bg-neutral-50 p-6 lg:sticky lg:top-28">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
                From our newsroom
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                News, project updates and practical insight from our engineering division in Nairobi.
              </p>
              <Link
                href="/news"
                className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-900 transition-colors hover:text-blue-700"
              >
                Explore all stories <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="bg-neutral-100 px-6 py-16 md:py-24">
            <div className="mx-auto w-full max-w-7xl">
              <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
                    Continue reading
                  </p>
                  <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-neutral-900 sm:text-3xl">
                    Similar stories
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600 transition-colors hover:text-blue-700"
                >
                  All news <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/news/${related.slug}`}
                    className="group flex h-full flex-col border border-neutral-200 bg-white"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200">
                      <Image
                        src={related.img}
                        alt={related.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                        {related.category} <span className="px-1 text-neutral-300">·</span>{" "}
                        {new Date(related.publishedAt).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-neutral-900 transition-colors group-hover:text-blue-700">
                        {related.title}
                      </h3>
                      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
                        Read story{" "}
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 text-blue-700 transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </ScrollRevealPage>
  );
}
