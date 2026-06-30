import Image from "next/image";
import { Calendar, ChevronRight, Eye, Home } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { NewsCard } from "@/components/news/news-card";
import { Link } from "@/i18n/navigation";
import type { NewsArticle } from "@/lib/news/types";
import { formatNewsDate } from "@/lib/news/utils";

interface ArticleContentProps {
  article: NewsArticle;
  relatedArticles: NewsArticle[];
}

export async function ArticleContent({
  article,
  relatedArticles,
}: ArticleContentProps): Promise<React.ReactElement> {
  const t = await getTranslations("news");
  const common = await getTranslations("common");
  const locale = await getLocale();
  const paragraphs = article.content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="section-container py-10 sm:py-14">
      <nav aria-label={common("breadcrumb")} className="mb-8 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-brand-primary">
          <Home aria-hidden="true" className="h-4 w-4" />
          {t("breadcrumbHome")}
        </Link>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
        <Link href="/news" className="hover:text-brand-primary">
          {t("breadcrumbNews")}
        </Link>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
        <span className="line-clamp-1 text-text-primary">{article.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="news-article-panel">
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand-primary">
                {article.author
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <span className="font-semibold uppercase tracking-wide text-text-primary">
                {article.author}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar aria-hidden="true" className="h-4 w-4" />
              <span>{formatNewsDate(article.publishedAt, locale)}</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Eye aria-hidden="true" className="h-4 w-4" />
              <span>
                {article.views} {t("viewsCount")}
              </span>
            </div>
          </div>

          <div className="news-article-cover">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 760px"
              className="object-cover"
            />
          </div>

          <div className="news-article-content">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          {article.images.length > 0 ? (
            <div className="mt-8 grid gap-6">
              {article.images.map((image) => (
                <div key={image} className="news-article-inline-image">
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 760px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </article>

        <aside className="space-y-6">
          <div className="news-sidebar-panel">
            <h2 className="news-sidebar-heading">{t("search")}</h2>
            <form action="/news" method="get" className="mt-4 flex gap-2">
              <input
                type="search"
                name="q"
                placeholder={t("searchPlaceholder")}
                className="form-input flex-1"
              />
              <button type="submit" className="btn-primary px-4 py-2.5">
                {t("go")}
              </button>
            </form>
          </div>

          <div className="news-sidebar-panel">
            <h2 className="news-sidebar-heading">{t("relatedArticles")}</h2>
            <div className="mt-4 space-y-4">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((related) => (
                  <NewsCard key={related.id} article={related} variant="compact" />
                ))
              ) : (
                <p className="text-sm text-text-secondary">{t("noRelated")}</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
