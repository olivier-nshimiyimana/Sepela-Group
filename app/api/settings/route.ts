import { NextResponse } from "next/server";

import { revalidatePublicSettings } from "@/lib/cache/revalidate";
import { isAdminRequest } from "@/lib/auth/admin";
import { apiError } from "@/lib/i18n/api";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings/storage";
import { siteSettingsSchema } from "@/lib/validations/product";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return apiError(request, "fetchSettingsFailed", 500);
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  if (!(await isAdminRequest(request))) {
    return apiError(request, "unauthorized", 401);
  }

  try {
    const body: unknown = await request.json();
    const parsed = siteSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(request, "invalidSettingsData", 400);
    }

    const settings = await updateSiteSettings(parsed.data);
    revalidatePublicSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Failed to update site settings:", error);
    return apiError(request, "updateSettingsFailed", 500);
  }
}
