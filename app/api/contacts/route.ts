import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/auth/admin";
import { getAllContactSubmissions } from "@/lib/contact/storage";
import { apiError } from "@/lib/i18n/api";

export async function GET(request: Request): Promise<NextResponse> {
  if (!(await isAdminRequest(request))) {
    return apiError(request, "unauthorized", 401);
  }

  try {
    const submissions = await getAllContactSubmissions();
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Failed to fetch contact submissions:", error);
    return apiError(request, "fetchContactsFailed", 500);
  }
}
