import { getTranslations } from "next-intl/server";

import { NewsCard } from "@/components/news/news-card";
import { Link } from "@/i18n/navigation";
import { getPublicArticles } from "@/lib/cache/public-data";

export async function NewsSection(): Promise<React.ReactElement> {
  const articles = await getPublicArticles();
  const latestArticles = articles.slice(0, 3);
  const t = await getTranslations("news");

  return (
    <section
      id="news"
      aria-labelledby="news-heading"
      className="bg-white section-spacing"
    >
      <div className="section-container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="news-heading" className="section-heading-dark">
            {t("heading")}
          </h2>
          <p className="section-description mt-4">{t("description")}</p>
        </div>

        {latestArticles.length > 0 ? (
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-base font-medium text-text-secondary sm:text-sm sm:font-normal">{t("empty")}</p>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/news" className="btn-outline">
            {t("seeAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
