import type { SiteSettings } from "@/lib/settings/types";

function pickNonEmpty(primary: string, fallback: string): string {
  const trimmedPrimary = primary.trim();
  const trimmedFallback = fallback.trim();
  return trimmedPrimary || trimmedFallback;
}

/** Prefer database values; fill empty fields from JSON fallback. */
export function mergeSiteSettings(
  primary: SiteSettings,
  fallback: SiteSettings,
): SiteSettings {
  return {
    email: pickNonEmpty(primary.email, fallback.email),
    phone: pickNonEmpty(primary.phone, fallback.phone),
    addressLine: pickNonEmpty(primary.addressLine, fallback.addressLine),
    city: pickNonEmpty(primary.city, fallback.city),
    country: pickNonEmpty(primary.country, fallback.country),
    footerTagline: pickNonEmpty(primary.footerTagline, fallback.footerTagline),
    facebookUrl: pickNonEmpty(primary.facebookUrl, fallback.facebookUrl),
    instagramUrl: pickNonEmpty(primary.instagramUrl, fallback.instagramUrl),
    xUrl: pickNonEmpty(primary.xUrl, fallback.xUrl),
    tiktokUrl: pickNonEmpty(primary.tiktokUrl, fallback.tiktokUrl),
    youtubeUrl: pickNonEmpty(primary.youtubeUrl, fallback.youtubeUrl),
    updatedAt:
      primary.updatedAt >= fallback.updatedAt
        ? primary.updatedAt
        : fallback.updatedAt,
  };
}
