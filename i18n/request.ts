import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { routing, type AppLocale } from "@/i18n/routing";

function isValidLocale(locale: string | undefined): locale is AppLocale {
  return locale === "fr" || locale === "en";
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!isValidLocale(locale)) {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

    if (isValidLocale(cookieLocale)) {
      locale = cookieLocale;
    } else {
      locale = routing.defaultLocale;
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
