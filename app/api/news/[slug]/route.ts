import { NextResponse } from "next/server";

import { revalidatePublicNews } from "@/lib/cache/revalidate";
import { isAdminRequest } from "@/lib/auth/admin";
import { apiError } from "@/lib/i18n/api";
import {
  deleteArticle,
  getArticleBySlug,
  updateArticle,
} from "@/lib/news/storage";
import { newsUpdateSchema } from "@/lib/validations/news";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;
    const article = await getArticleBySlug(slug);

    if (!article) {
      return apiError(request, "articleNotFound", 404);
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return apiError(request, "fetchArticleFailed", 500);
  }
}

export async function PUT(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  if (!(await isAdminRequest(request))) {
    return apiError(request, "unauthorized", 401);
  }

  try {
    const { slug } = await context.params;
    const body: unknown = await request.json();
    const parsed = newsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(request, "invalidArticleData", 400);
    }

    const article = await updateArticle(slug, parsed.data);

    if (!article) {
      return apiError(request, "articleNotFound", 404);
    }

    revalidatePublicNews();
    return NextResponse.json({ article });
  } catch (error) {
    console.error("Failed to update article:", error);
    return apiError(request, "updateArticleFailed", 500);
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  if (!(await isAdminRequest(request))) {
    return apiError(request, "unauthorized", 401);
  }

  try {
    const { slug } = await context.params;
    const deleted = await deleteArticle(slug);

    if (!deleted) {
      return apiError(request, "articleNotFound", 404);
    }

    revalidatePublicNews();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete article:", error);
    return apiError(request, "deleteArticleFailed", 500);
  }
}
