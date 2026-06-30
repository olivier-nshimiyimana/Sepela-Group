import { NextResponse } from "next/server";

import { revalidatePublicNews } from "@/lib/cache/revalidate";
import { isAdminRequest } from "@/lib/auth/admin";
import { apiError } from "@/lib/i18n/api";
import { createArticle, getAllArticles } from "@/lib/news/storage";
import { newsArticleSchema } from "@/lib/validations/news";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const articles = await getAllArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Failed to fetch news articles:", error);
    return apiError(request, "fetchArticlesFailed", 500);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAdminRequest(request))) {
    return apiError(request, "unauthorized", 401);
  }

  try {
    const body: unknown = await request.json();
    const parsed = newsArticleSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(request, "invalidArticleData", 400);
    }

    const article = await createArticle(parsed.data);
    revalidatePublicNews();
    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("Failed to create news article:", error);
    return apiError(request, "createArticleFailed", 500);
  }
}
