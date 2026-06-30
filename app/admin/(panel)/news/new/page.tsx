import { getTranslations } from "next-intl/server";

import { NewsForm } from "@/components/admin/news-form";

export default async function AdminNewArticlePage(): Promise<React.ReactElement> {
  const t = await getTranslations("admin.news");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-text-primary">{t("createPageTitle")}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t("createPageDescription")}</p>
      <div className="mt-8">
        <NewsForm mode="create" />
      </div>
    </div>
  );
}
