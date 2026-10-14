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

async function getArticle(slug: string): Promise<NewsArticleContent | null> {
  const sample = defaultArticles.find((article) => article.slug === slug);
  if (sample) return sample;

  const article = await prisma.newsArticle.findUnique({ where: { slug } });
  if (!article) return null;

  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.content.length > 180
      ? `${article.content.slice(0, 180)}...`
      : article.content,
    content: article.content,
    publishedAt: article.publishedAt.toISOString().split("T")[0],
    category: "Engineering News",
    img: article.imageUrl || "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1200",
    featured: false,
  };
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  return article
    ? {
        title: `${article.title} | Specialized Engineering Kenya Ltd.`,
        description: article.excerpt,
      }
    : { title: "Story | Specialized Engineering Kenya Ltd." };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const databaseStories = await prisma.newsArticle.findMany({
    where: { slug: { not: article.slug } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
  const relatedArticles: NewsArticleContent[] = databaseStories.length > 0
    ? databaseStories.map((item) => ({
        slug: item.slug,
        title: item.title,
        excerpt: item.content.length > 180 ? `${item.content.slice(0, 180)}...` : item.content,
        content: item.content,
        publishedAt: item.publishedAt.toISOString().split("T")[0],
        category: "Engineering News",
        img: item.imageUrl || "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1200",
        featured: false,
      }))
    : defaultArticles
        .filter((item) => item.slug !== article.slug)
        .sort((left, right) => Number(right.category === article.category) - Number(left.category === article.category))
        .slice(0, 3);
  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <ScrollRevealPage>
    <main className="min-h-screen bg-white text-neutral-900">
      <header className="relative flex min-h-[64vh] items-end overflow-hidden bg-neutral-950 pb-12 pt-32 text-white md:min-h-[76vh] md:pb-16">
        <Image
          src={article.img}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
          <Link
            href="/news"
            className="mb-10 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            All news &amp; insights
          </Link>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-2 text-xs text-white/70">
              <Calendar aria-hidden="true" className="h-4 w-4 text-blue-300" />
              {article.publishedAt}
            </span>
          </div>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-white/75 md:text-lg">
            {article.excerpt}
          </p>
        </div>
      </header>

      <article className="px-6 py-16 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-20">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 h-1 w-16 bg-blue-600" />
            <div className="space-y-6 text-base leading-8 text-neutral-700 md:text-lg md:leading-9">
              {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-12 border-t border-neutral-200 pt-6">
              <Link href="/news" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700 transition-colors hover:text-blue-700">
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
              News, project updates and practical insight from our engineering team.
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
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">Continue reading</p>
                <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight text-neutral-900 sm:text-3xl">
                  Similar stories
                </h2>
              </div>
              <Link href="/news" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600 transition-colors hover:text-blue-700">
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
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                      {related.category} <span className="px-1 text-neutral-300">·</span> {related.publishedAt}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-neutral-900 transition-colors group-hover:text-blue-700">
                      {related.title}
                    </h3>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
                      Read story <ArrowRight aria-hidden="true" className="h-4 w-4 text-blue-700 transition-transform group-hover:translate-x-1" />
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
