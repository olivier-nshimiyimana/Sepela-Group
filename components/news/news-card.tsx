import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import type { NewsArticle } from "@/lib/news/types";
import { formatNewsDate } from "@/lib/news/utils";
import { Link } from "@/i18n/navigation";

interface NewsCardProps {
  article: NewsArticle;
  variant?: "default" | "compact";
}

export async function NewsCard({
  article,
  variant = "default",
}: NewsCardProps): Promise<React.ReactElement> {
  const t = await getTranslations("news");
  const locale = await getLocale();

  if (variant === "compact") {
    return (
      <article className="news-card-compact">
        <Link href={`/news/${article.slug}`} className="news-card-compact-link">
          <div className="news-card-compact-image">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-text-primary sm:text-sm sm:font-semibold">
              {article.title}
            </h3>
            <div className="mt-2 flex items-center gap-3 text-sm font-medium text-text-secondary sm:text-xs sm:font-normal">
              <span>{formatNewsDate(article.publishedAt, locale)}</span>
              <span>
                {article.views} {t("views")}
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="news-card group">
      <Link href={`/news/${article.slug}`} className="news-card-link">
        <div className="news-card-image">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="news-card-body">
          <span className="news-date-badge">
            {formatNewsDate(article.publishedAt, locale)}
          </span>
          <h3 className="news-card-title">{article.title}</h3>
          <p className="news-card-excerpt">{article.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
