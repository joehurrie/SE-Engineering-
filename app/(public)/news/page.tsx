import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, ArrowUpRight } from "lucide-react";
import prisma from "@/lib/prisma";
import ScrollRevealPage from "@/components/ScrollRevealPage";
import { defaultArticles, type NewsArticleContent } from "@/lib/news-data";
import { getContentValue, loadSiteContentMap } from "@/lib/home-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News & Insights — Elevator Industry Updates | Specialized Engineering Kenya",
  description:
    "Latest news, engineering insights, elevator industry updates, and project announcements from Specialized Engineering Kenya Ltd. — East Africa's vertical transport leader.",
  keywords: [
    "elevator news Kenya", "lift industry insights", "engineering updates Kenya",
    "Specialized Engineering news", "vertical transport East Africa",
  ],
  openGraph: {
    title: "News & Engineering Insights | Specialized Engineering Kenya",
    description: "Stay up to date with the latest elevator industry news, project completions, and engineering insights from Specialized Engineering Kenya.",
  },
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

export default async function NewsPage() {
  let articles: NewsArticleContent[] = defaultArticles;
  let content: Awaited<ReturnType<typeof loadSiteContentMap>> = {};

  try {
    content = await loadSiteContentMap(["news_hero", "news_featured", "news_archive", "news_cta"]);
  } catch (error) {
    console.error("Failed to load News page content:", error);
  }

  try {
    const dbArticles = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: "desc" },
    });

    if (dbArticles && dbArticles.length > 0) {
      articles = (dbArticles as unknown as DbNewsItem[]).map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt:
          a.excerpt && a.excerpt.trim().length > 0
            ? a.excerpt.trim()
            : a.content.length > 180
              ? a.content.slice(0, 180) + "..."
              : a.content,
        content: a.content,
        publishedAt: a.publishedAt.toISOString().split("T")[0],
        category: a.category || "Engineering News",
        img: a.imageUrl || "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1200",
        featured: Boolean(a.featured),
      }));
    }
  } catch (error) {
    console.error("Failed to fetch news from DB:", error);
  }

  const featured = articles.filter((a) => a.featured);
  const heroVideo = content.news_hero?.videoUrl?.trim();

  return (
    <ScrollRevealPage className="bg-white text-[#111111] min-h-screen">
      {/* ── 1. Hero: Standardized Dimensions (100% view height on mobile, 70vh on desktop) ── */}
      <section className="relative flex min-h-[100svh] md:min-h-0 md:h-[70vh] items-center justify-center overflow-hidden border-b border-neutral-200 bg-[#F5F5F3] px-6 py-12 md:py-16 text-center">
        <div className="absolute inset-0 z-0">
          {heroVideo ? (
            <video src={heroVideo} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <img
              src={getContentValue(
                content.news_hero,
                "imageUrl",
                "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1600"
              )}
              alt="Engineering News & Insights"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            {getContentValue(content.news_hero, "subtitle", "EDITORIAL & INSIGHTS")}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white drop-shadow-lg mb-2 text-center">
            {getContentValue(content.news_hero, "title", "News & Insights.")}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-4" />
          <p className="text-white drop-shadow-lg text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
            {getContentValue(
              content.news_hero,
              "bodyText",
              "Stay informed with the latest project completions, engineering updates, and vertical transportation industry insights from our engineering division in Nairobi."
            )}
          </p>
        </div>
      </section>

      {/* ── 2. Featured Articles Grid ─────────────────────────── */}
      <section className="w-full min-h-[50vh] md:min-h-[60vh] py-24 md:py-32 bg-neutral-50 border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-16 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-4 border border-neutral-200">
              {getContentValue(content.news_featured, "badge", "Featured Coverage")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black mb-4 text-center">
              {getContentValue(content.news_featured, "title", "Featured Stories.")}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {featured.length > 0 ? (
              featured.map((article) => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="group flex flex-col overflow-hidden rounded-none border border-neutral-200 bg-white transition-all duration-300 hover:border-blue-600/40 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={article.img}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors"
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white drop-shadow">
                      <span className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        {new Date(article.publishedAt).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="bg-blue-600 px-2.5 py-0.5 text-[10px] font-mono font-bold text-white uppercase">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 md:p-8 space-y-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="mt-3 text-sm text-neutral-600 font-light leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="pt-4 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100">
                      <span className="font-mono text-neutral-500">Specialized Engineering Kenya</span>
                      <span className="text-blue-600 font-semibold inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                        Read Analysis <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center gap-3 border border-neutral-200 bg-white p-8">
                <p className="text-neutral-500 text-sm font-medium">No articles are currently marked as featured.</p>
                <p className="text-neutral-400 text-xs">
                  In the CMS, toggle &quot;Featured Story&quot; on any article to spotlight it here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. Article Archive List ───────────────────────────── */}
      <section className="w-full min-h-[75vh] md:min-h-screen py-28 md:py-40 bg-white border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-16 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-4 border border-neutral-200">
              {getContentValue(content.news_archive, "badge", "Industry Archive")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black mb-4 text-center">
              {getContentValue(content.news_archive, "title", "Archive & Insights.")}
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>

          <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200 w-full">
            {articles.length > 0 ? (
              articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="group py-10 px-6 sm:px-10 flex flex-col md:flex-row gap-8 items-start md:items-center hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div className="w-full md:w-48 h-48 md:h-32 rounded-none overflow-hidden shrink-0 border border-neutral-200 bg-neutral-100">
                    <img
                      src={article.img}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-blue-600 text-xs font-bold uppercase tracking-wider font-mono">
                        {article.category}
                      </span>
                      <span className="text-neutral-300">·</span>
                      <span className="text-neutral-500 text-xs font-mono">
                        {new Date(article.publishedAt).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      {article.featured && (
                        <>
                          <span className="text-neutral-300">·</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 border border-blue-200">
                            Featured
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-black font-bold text-xl sm:text-2xl leading-snug group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-light line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-none bg-white border border-neutral-200 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors hidden md:flex">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center gap-3">
                <p className="text-neutral-400 text-base font-light">No articles published yet.</p>
                <p className="text-neutral-300 text-sm">Engineering insights and project updates coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. Consultation CTA ───────────────────────────────── */}
      <section className="w-full min-h-[50vh] bg-neutral-100 py-28 md:py-36 text-center relative overflow-hidden flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-6">
          <div className="inline-block px-3 py-1 bg-white text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-neutral-200">
            {getContentValue(content.news_cta, "badge", "Direct Press & Media")}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 uppercase tracking-tight">
            {getContentValue(content.news_cta, "title", "Media & Technical Inquiries.")}
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto" />
          <p className="text-neutral-600 text-sm md:text-base font-light leading-relaxed">
            {getContentValue(
              content.news_cta,
              "bodyText",
              "For press briefings, architectural case studies, or technical documentation, contact our communications desk in Nairobi."
            )}
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href={getContentValue(content.news_cta, "buttonHref", "/contact")}
              className="h-14 px-8 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 rounded-none transition-colors"
            >
              <span>{getContentValue(content.news_cta, "buttonLabel", "Contact Press Desk")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </ScrollRevealPage>
  );
}
