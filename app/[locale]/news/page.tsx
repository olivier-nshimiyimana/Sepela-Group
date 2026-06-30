import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { NewsCard } from "@/components/news/news-card";
import { Link } from "@/i18n/navigation";
import { getPublicArticles } from "@/lib/cache/public-data";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("news");

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

interface NewsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function NewsPage({
  searchParams,
}: NewsPageProps): Promise<React.ReactElement> {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() ?? "";
  const articles = await getPublicArticles();
  const t = await getTranslations("news");
  const filteredArticles = query
    ? articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query),
      )
    : articles;

  return (
    <main className="flex min-h-screen flex-col bg-white pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/softbackground.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="news-hero-overlay absolute inset-0" />
        </div>
        <div className="section-container relative z-10 py-20 text-center sm:py-24">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t("heading")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 sm:text-base">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      <section className="section-container py-14 sm:py-16">
        {query ? (
          <p className="mb-8 text-sm text-text-secondary">
            {t("showingResults")} <strong>{q}</strong>
          </p>
        ) : null}

        {filteredArticles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-brand-muted px-6 py-16 text-center">
            <p className="text-lg font-semibold text-text-primary">
              {t("noArticlesTitle")}
            </p>
            <p className="mt-2 text-text-secondary">
              {t("noArticlesDescription")}
            </p>
            <Link href="/news" className="btn-outline mt-6 inline-flex">
              {t("viewAll")}
            </Link>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
