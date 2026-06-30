import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

import { formatNewsDate } from "@/lib/news/utils";
import { getAllArticles } from "@/lib/news/storage";
import { Link as LocaleLink } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage(): Promise<React.ReactElement> {
  const articles = await getAllArticles(true);
  const t = await getTranslations("admin.news");
  const status = await getTranslations("admin.status");
  const actions = await getTranslations("admin.actions");
  const nav = await getTranslations("admin.nav");
  const locale = await getLocale();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{t("listTitle")}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t("listDescription")}</p>
        </div>
        <Link href="/admin/news/new" className="btn-primary px-5 py-2.5 text-xs">
          {nav("newArticle")}
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 text-text-secondary">
            <tr>
              <th className="px-3 py-3 font-semibold">{t("tableTitle")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableDate")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableStatus")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableViews")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableActions")}</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-b border-gray-50">
                <td className="px-3 py-4 font-medium text-text-primary">
                  {article.title}
                </td>
                <td className="px-3 py-4 text-text-secondary">
                  {formatNewsDate(article.publishedAt, locale)}
                </td>
                <td className="px-3 py-4">
                  <span
                    className={
                      article.published
                        ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700"
                        : "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
                    }
                  >
                    {article.published ? status("published") : status("draft")}
                  </span>
                </td>
                <td className="px-3 py-4 text-text-secondary">{article.views}</td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/news/${article.slug}/edit`}
                      className="text-brand-primary hover:underline"
                    >
                      {actions("edit")}
                    </Link>
                    <LocaleLink
                      href={`/news/${article.slug}`}
                      className="text-text-secondary hover:text-brand-primary"
                    >
                      {actions("view")}
                    </LocaleLink>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 ? (
          <p className="py-10 text-center text-text-secondary">{t("empty")}</p>
        ) : null}
      </div>
    </div>
  );
}
