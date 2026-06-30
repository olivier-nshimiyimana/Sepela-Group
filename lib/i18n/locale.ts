import { cookies, headers } from "next/headers";

import { routing, type AppLocale } from "@/i18n/routing";

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return value === "en" || value === "fr";
}

export async function getRequestLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  if (isAppLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headerStore = await headers();
  const headerLocale = headerStore.get("x-locale");

  if (isAppLocale(headerLocale)) {
    return headerLocale;
  }

  return routing.defaultLocale;
}

export function getRequestLocaleFromRequest(request: Request): AppLocale {
  const headerLocale = request.headers.get("x-locale");

  if (isAppLocale(headerLocale)) {
    return headerLocale;
  }

  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";

  if (accept.includes("en") && !accept.includes("fr")) {
    return "en";
  }

  return routing.defaultLocale;
}
