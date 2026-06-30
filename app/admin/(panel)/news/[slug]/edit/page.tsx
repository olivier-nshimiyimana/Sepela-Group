import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { NewsForm } from "@/components/admin/news-form";
import { getArticleBySlug } from "@/lib/news/storage";

export const dynamic = "force-dynamic";

interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, true);
  const t = await getTranslations("admin.news");

  if (!article) {
    notFound();
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-text-primary">{t("editPageTitle")}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t("editPageDescription")}</p>
      <div className="mt-8">
        <NewsForm mode="edit" initialArticle={article} />
      </div>
    </div>
  );
}
