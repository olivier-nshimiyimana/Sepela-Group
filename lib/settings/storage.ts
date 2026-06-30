import { getSql } from "@/lib/db/client";
import { mapSiteSettingsRow, type SiteSettingsRow } from "@/lib/db/mappers";
import { withDatabaseRead, withDatabaseWrite } from "@/lib/db/resilience";
import {
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
  type SiteSettingsInput,
} from "@/lib/settings/types";
import {
  getSiteSettingsFromJson,
  syncSiteSettingsToJson,
  updateSiteSettingsInJson,
} from "@/lib/settings/storage-json";
import { mergeSiteSettings } from "@/lib/settings/merge";

export async function getSiteSettings(): Promise<SiteSettings> {
  const jsonSettings = await getSiteSettingsFromJson();

  return withDatabaseRead(
    async () => {
      const sql = getSql();
      const rows = (await sql`
        SELECT
          email,
          phone,
          address_line,
          city,
          country,
          footer_tagline,
          facebook_url,
          instagram_url,
          x_url,
          tiktok_url,
          youtube_url,
          updated_at
        FROM site_settings
        WHERE id = 'default'
        LIMIT 1
      `) as SiteSettingsRow[];

      const row = rows[0];
      const dbSettings = row ? mapSiteSettingsRow(row) : DEFAULT_SITE_SETTINGS;
      const merged = mergeSiteSettings(dbSettings, jsonSettings);

      try {
        await syncSiteSettingsToJson(merged);
      } catch (error) {
        console.warn("[settings] Failed to back up settings to JSON:", error);
      }

      return merged;
    },
    async () => jsonSettings,
  );
}

export async function updateSiteSettings(
  input: SiteSettingsInput,
): Promise<SiteSettings> {
  return withDatabaseWrite(
    async () => {
      const sql = getSql();
      const updatedAt = new Date().toISOString();

      const rows = (await sql`
        INSERT INTO site_settings (
          id,
          email,
          phone,
          address_line,
          city,
          country,
          footer_tagline,
          facebook_url,
          instagram_url,
          x_url,
          tiktok_url,
          youtube_url,
          updated_at
        )
        VALUES (
          'default',
          ${input.email},
          ${input.phone},
          ${input.addressLine},
          ${input.city},
          ${input.country},
          ${input.footerTagline},
          ${input.facebookUrl},
          ${input.instagramUrl},
          ${input.xUrl},
          ${input.tiktokUrl},
          ${input.youtubeUrl},
          ${updatedAt}
        )
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          address_line = EXCLUDED.address_line,
          city = EXCLUDED.city,
          country = EXCLUDED.country,
          footer_tagline = EXCLUDED.footer_tagline,
          facebook_url = EXCLUDED.facebook_url,
          instagram_url = EXCLUDED.instagram_url,
          x_url = EXCLUDED.x_url,
          tiktok_url = EXCLUDED.tiktok_url,
          youtube_url = EXCLUDED.youtube_url,
          updated_at = EXCLUDED.updated_at
        RETURNING
          email,
          phone,
          address_line,
          city,
          country,
          footer_tagline,
          facebook_url,
          instagram_url,
          x_url,
          tiktok_url,
          youtube_url,
          updated_at
      `) as SiteSettingsRow[];

      const row = rows[0];
      if (!row) {
        throw new Error("Failed to update site settings.");
      }

      const settings = mapSiteSettingsRow(row);

      try {
        await syncSiteSettingsToJson(settings);
      } catch (error) {
        console.warn("[settings] Failed to sync site settings to JSON:", error);
      }

      return settings;
    },
    () => updateSiteSettingsInJson(input),
  );
}
