import { NextResponse } from "next/server";

import {
  createAdminSessionToken,
  getAdminCookieName,
  verifyAdminPassword,
} from "@/lib/auth/admin";
import { apiError } from "@/lib/i18n/api";
import { adminLoginSchema } from "@/lib/validations/admin";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(request, "invalidLogin", 400);
    }

    if (!verifyAdminPassword(parsed.data.password)) {
      return apiError(request, "invalidPassword", 401);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(getAdminCookieName(), await createAdminSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Admin login failed:", error);
    return apiError(request, "loginFailed", 500);
  }
}
