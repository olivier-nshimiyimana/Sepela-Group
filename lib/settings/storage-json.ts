import { promises as fs } from "fs";
import path from "path";

import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
  type SiteSettingsInput,
} from "@/lib/settings/types";

const DATA_FILE = path.join(process.cwd(), "data", "site-settings.json");

export async function getSiteSettingsFromJson(): Promise<SiteSettings> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return { ...DEFAULT_SITE_SETTINGS, ...(JSON.parse(raw) as SiteSettings) };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function syncSiteSettingsToJson(
  settings: SiteSettings,
): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(settings, null, 2), "utf8");
}

export async function updateSiteSettingsInJson(
  input: SiteSettingsInput,
): Promise<SiteSettings> {
  const settings: SiteSettings = {
    ...input,
    updatedAt: new Date().toISOString(),
  };

  await syncSiteSettingsToJson(settings);

  return settings;
}
