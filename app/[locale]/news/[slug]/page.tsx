import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { ArticleContent } from "@/components/news/article-content";
import {
  getPublicArticleBySlug,
  getPublicArticles,
} from "@/lib/cache/public-data";
import { incrementArticleViews } from "@/lib/news/storage";

export const revalidate = 60;

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);
  const t = await getTranslations("news");

  if (!article) {
    return { title: t("articleNotFound") };
  }

  return {
    title: `${article.title} | Sepela Group`,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  await incrementArticleViews(slug);

  const allArticles = await getPublicArticles();
  const relatedArticles = allArticles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 4);

  return (
    <main className="flex min-h-screen flex-col bg-white pt-20">
      <ArticleContent article={article} relatedArticles={relatedArticles} />
      <Footer />
    </main>
  );
}
