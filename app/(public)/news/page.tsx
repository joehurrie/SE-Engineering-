import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, ArrowUpRight } from "lucide-react";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News & Insights",
  description:
    "Latest news, industry insights, and engineering updates from Specialized Engineering Kenya Ltd.",
};

const defaultArticles = [
  {
    slug: "talanta-hela-stadium-escalators",
    title: "Specialized Engineering Completes Talanta Hela Stadium Escalator Installation",
    excerpt:
      "Our team successfully installed and commissioned 10 heavy-duty escalators and moving walks at Talanta Hela Stadium, a landmark East African venue.",
    publishedAt: "2023-11-15",
    category: "Project Update",
    img: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&q=80&w=1200",
    featured: true,
  },
  {
    slug: "xizi-partnership-expansion",
    title: "SE Kenya Strengthens XIZI Exclusive Supply Partnership Across East Africa",
    excerpt:
      "We are proud to announce an expanded exclusive supply agreement with international manufacturer XIZI, introducing smart regenerative traction drives to Nairobi.",
    publishedAt: "2023-09-08",
    category: "Corporate Partnership",
    img: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=1200",
    featured: false,
  },
  {
    slug: "200-elevators-milestone",
    title: "Celebrating 200+ Operational Elevator Installations Across Kenya",
    excerpt:
      "A landmark achievement for our engineering corps as we crossed the 200 installation milestone, reflecting 8+ years of developer trust and safety excellence.",
    publishedAt: "2024-03-20",
    category: "Corporate Milestone",
    img: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&q=80&w=1200",
    featured: true,
  },
  {
    slug: "hospital-elevator-standards",
    title: "Medical-Grade Elevator Standards & Bed Transit Requirements in Kenya",
    excerpt:
      "A technical appraisal of the rigorous micro-leveling precision and emergency priority dispatch needed for modern healthcare facilities.",
    publishedAt: "2024-01-12",
    category: "Engineering Insight",
    img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1200",
    featured: false,
  },
  {
    slug: "elevator-modernization-benefits",
    title: "5 Key Indicators That Your Commercial Tower Elevator Requires Modernization",
    excerpt:
      "Discover how controller retrofits and VVVF drive modernizations reduce energy bills by up to 35% while virtually eliminating erratic floor stoppages.",
    publishedAt: "2023-07-25",
    category: "Preventative Maintenance",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200",
    featured: false,
  },
];

export default async function NewsPage() {
  let articles = defaultArticles;

  try {
    const dbArticles = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: "desc" },
    });

    if (dbArticles && dbArticles.length > 0) {
      articles = dbArticles.map((a, i) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.content.length > 180 ? a.content.slice(0, 180) + "..." : a.content,
        publishedAt: a.publishedAt.toISOString().split("T")[0],
        category: "Engineering News",
        img: a.imageUrl || "https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1200",
        featured: i < 2,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch news from DB:", error);
  }

  const featured = articles.filter((a) => a.featured);

  return (
    <div className="bg-white text-[#111111] min-h-screen">

      {/* ── 1. Hero: 50vh View Height (Centered) ───────────── */}
      <section className="min-h-[50vh] min-h-[50svh] min-h-[380px] pt-32 pb-16 relative overflow-hidden border-b border-neutral-900 flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&q=80&w=1600"
            alt="Engineering News & Insights"
            className="w-full h-full object-cover brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center justify-center text-center my-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
            EDITORIAL &amp; INSIGHTS
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white mb-2 text-center">
            News &amp; Insights.
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-4" />
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed text-center">
            Stay informed with the latest project completions, engineering updates, and vertical transportation
            industry insights from our engineering division in Nairobi.
          </p>
        </div>
      </section>

      {/* ── 2. Featured Articles Grid ─────────────────────────── */}
      <section className="w-full min-h-[75vh] md:min-h-screen py-28 md:py-40 bg-neutral-50 border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-16 flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 bg-white text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-4 border border-neutral-200">
              Featured Coverage
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black mb-4 text-center">
              Featured Stories.
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featured.map((article) => (
              <div
                key={article.slug}
                className="group relative h-96 sm:h-[480px] rounded-none overflow-hidden border border-neutral-200 flex flex-col justify-end shadow-md"
              >
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-10 sm:p-12 space-y-4 z-10">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-blue-600 text-white">
                      {article.category}
                    </span>
                    <span className="text-neutral-400 text-xs font-mono">
                      {article.publishedAt}
                    </span>
                  </div>

                  <h3 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
                    {article.title}
                  </h3>

                  <p className="text-neutral-300 text-base leading-relaxed font-light line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="pt-4 flex items-center justify-between text-xs text-neutral-400 border-t border-white/10">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      Specialized Engineering Kenya
                    </span>
                    <span className="text-white font-medium inline-flex items-center gap-1.5 group-hover:text-blue-400 transition-colors">
                      Read Analysis <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Article Archive List ───────────────────────────── */}
      <section className="w-full min-h-[75vh] md:min-h-screen py-28 md:py-40 bg-white border-b border-neutral-200 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-16 flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase tracking-widest mb-4 border border-neutral-200">
              Industry Archive
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black mb-4 text-center">
              Archive &amp; Insights.
            </h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto" />
          </div>

          <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="group py-10 px-8 sm:px-10 flex flex-col md:flex-row gap-8 items-start md:items-center hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <div className="w-48 h-32 rounded-none overflow-hidden shrink-0 border border-neutral-200">
                  <img src={article.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 text-xs font-bold uppercase tracking-wider font-mono">
                      {article.category}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span className="text-neutral-500 text-xs font-mono">
                      {article.publishedAt}
                    </span>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Consultation CTA ───────────────────────────────── */}
      <section className="w-full min-h-[50vh] bg-black py-28 md:py-36 text-center relative overflow-hidden flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 relative z-10 space-y-6">
          <div className="inline-block px-3 py-1 bg-neutral-900 text-neutral-400 text-[10px] font-bold uppercase tracking-widest border border-neutral-800">
            Direct Press &amp; Media
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
            Media &amp; Technical Inquiries.
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto" />
          <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed">
            For press briefings, architectural case studies, or technical documentation, contact our communications desk in Nairobi.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/contact"
              className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 rounded-none transition-colors"
            >
              <span>Contact Press Desk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
