import { NextResponse } from "next/server";

import { revalidatePublicProducts } from "@/lib/cache/revalidate";
import { isAdminRequest } from "@/lib/auth/admin";
import { getApiErrorResponse } from "@/lib/db/resilience";
import { apiError } from "@/lib/i18n/api";
import { createProduct, getAllProducts } from "@/lib/products/storage";
import { productSchema } from "@/lib/validations/product";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (error) {
    const { key, status } = getApiErrorResponse(error);
    console.error("Failed to fetch products:", error);
    return apiError(request, key === "unexpected" ? "fetchProductsFailed" : key, status);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAdminRequest(request))) {
    return apiError(request, "unauthorized", 401);
  }

  try {
    const body: unknown = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(request, "invalidProductData", 400);
    }

    const product = await createProduct(parsed.data);
    revalidatePublicProducts();
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const { key, status } = getApiErrorResponse(error);
    console.error("Failed to create product:", error);
    return apiError(request, key === "unexpected" ? "createProductFailed" : key, status);
  }
}
