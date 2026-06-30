import { NextResponse } from "next/server";

import { revalidatePublicProducts } from "@/lib/cache/revalidate";
import { isAdminRequest } from "@/lib/auth/admin";
import { getApiErrorResponse } from "@/lib/db/resilience";
import { apiError } from "@/lib/i18n/api";
import {
  deleteProduct,
  getProductBySlug,
  updateProduct,
} from "@/lib/products/storage";
import { productUpdateSchema } from "@/lib/validations/product";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return apiError(request, "productNotFound", 404);
    }

    return NextResponse.json({ product });
  } catch (error) {
    const { key, status } = getApiErrorResponse(error);
    console.error("Failed to fetch product:", error);
    return apiError(request, key === "unexpected" ? "fetchProductFailed" : key, status);
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
    const parsed = productUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(request, "invalidProductData", 400);
    }

    const product = await updateProduct(slug, parsed.data);

    if (!product) {
      return apiError(request, "productNotFound", 404);
    }

    revalidatePublicProducts();
    return NextResponse.json({ product });
  } catch (error) {
    const { key, status } = getApiErrorResponse(error);
    console.error("Failed to update product:", error);
    return apiError(request, key === "unexpected" ? "updateProductFailed" : key, status);
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
    const deleted = await deleteProduct(slug);

    if (!deleted) {
      return apiError(request, "productNotFound", 404);
    }

    revalidatePublicProducts();
    return NextResponse.json({ success: true });
  } catch (error) {
    const { key, status } = getApiErrorResponse(error);
    console.error("Failed to delete product:", error);
    return apiError(request, key === "unexpected" ? "deleteProductFailed" : key, status);
  }
}
