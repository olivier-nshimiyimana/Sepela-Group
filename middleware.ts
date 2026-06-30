import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  getAdminCookieName,
  isValidAdminSessionToken,
} from "@/lib/auth/admin";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

async function handleAdminRequest(
  request: NextRequest,
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/news", request.url));
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get(getAdminCookieName())?.value;

    if (await isValidAdminSessionToken(token)) {
      return NextResponse.redirect(new URL("/admin/news", request.url));
    }

    return NextResponse.next();
  }

  const token = request.cookies.get(getAdminCookieName())?.value;

  if (!(await isValidAdminSessionToken(token))) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Common typos: /fradmin or /enadmin (missing slash) → /admin
  const localeAdminTypoMatch = pathname.match(/^\/(fr|en)admin(?:\/(.*))?$/);

  if (localeAdminTypoMatch) {
    const adminSubpath = localeAdminTypoMatch[2] ? `/${localeAdminTypoMatch[2]}` : "";
    return NextResponse.redirect(new URL(`/admin${adminSubpath}`, request.url));
  }

  // Admin routes are not locale-prefixed — /fr/admin → /admin
  const localeAdminMatch = pathname.match(/^\/(fr|en)\/admin(?:\/(.*))?$/);

  if (localeAdminMatch) {
    const adminSubpath = localeAdminMatch[2] ? `/${localeAdminMatch[2]}` : "";
    return NextResponse.redirect(new URL(`/admin${adminSubpath}`, request.url));
  }

  if (pathname.startsWith("/admin")) {
    return handleAdminRequest(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(fr|en)/:path*",
    "/(fr|en)admin",
    "/(fr|en)admin/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
