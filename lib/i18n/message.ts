import type { AppLocale } from "@/i18n/routing";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

const catalogs: Record<AppLocale, typeof en> = {
  en,
  fr,
};

export function getMessage(
  locale: AppLocale,
  path: string,
  values?: Record<string, string | number>,
): string {
  const parts = path.split(".");
  let current: unknown = catalogs[locale];

  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return path;
    }

    current = (current as Record<string, unknown>)[part];
  }

  if (typeof current !== "string") {
    return path;
  }

  if (!values) {
    return current;
  }

  return Object.entries(values).reduce(
    (message, [key, value]) => message.replace(`{${key}}`, String(value)),
    current,
  );
}
