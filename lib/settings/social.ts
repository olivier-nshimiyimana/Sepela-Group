import type { SiteSettings } from "@/lib/settings/types";

export interface SocialPlatform {
  key: keyof Pick<
    SiteSettings,
    "facebookUrl" | "instagramUrl" | "xUrl" | "tiktokUrl" | "youtubeUrl"
  >;
  label: string;
}

export const SOCIAL_PLATFORMS: readonly SocialPlatform[] = [
  { key: "facebookUrl", label: "Facebook" },
  { key: "instagramUrl", label: "Instagram" },
  { key: "xUrl", label: "X" },
  { key: "tiktokUrl", label: "TikTok" },
  { key: "youtubeUrl", label: "YouTube" },
] as const;

export function getActiveSocialLinks(
  settings: SiteSettings,
): Array<{ label: string; href: string }> {
  return SOCIAL_PLATFORMS.flatMap((platform) => {
    const href = settings[platform.key].trim();
    if (!href) {
      return [];
    }

    return [{ label: platform.label, href }];
  });
}
