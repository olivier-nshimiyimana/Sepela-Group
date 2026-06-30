"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname as useNextPathname, useRouter as useNextRouter } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const LOCALE_LABELS: Record<AppLocale, string> = {
  fr: "FR",
  en: "ENG",
};

function setLocaleCookie(locale: AppLocale): void {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export function LanguageSwitcher(): React.ReactElement {
  const locale = useLocale() as AppLocale;
  const common = useTranslations("common");
  const intlRouter = useRouter();
  const intlPathname = usePathname();
  const nextRouter = useNextRouter();
  const nextPathname = useNextPathname();
  const isAdminRoute = nextPathname.startsWith("/admin");

  function switchLocale(nextLocale: AppLocale): void {
    if (nextLocale === locale) {
      return;
    }

    setLocaleCookie(nextLocale);

    if (isAdminRoute) {
      nextRouter.refresh();
      return;
    }

    intlRouter.replace(intlPathname, { locale: nextLocale });
  }

  return (
    <div
      role="group"
      aria-label={common("language")}
      className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-1 text-sm font-bold sm:p-0.5 sm:text-xs sm:font-semibold"
    >
      {routing.locales.map((option) => {
        const isActive = option === locale;

        return (
          <button
            key={option}
            type="button"
            onClick={() => switchLocale(option)}
            aria-pressed={isActive}
            className={`rounded-md px-3 py-2 transition-colors sm:px-2.5 sm:py-1.5 ${
              isActive
                ? "bg-brand-primary text-white"
                : "text-text-secondary hover:text-brand-primary"
            }`}
          >
            {LOCALE_LABELS[option]}
          </button>
        );
      })}
    </div>
  );
}
