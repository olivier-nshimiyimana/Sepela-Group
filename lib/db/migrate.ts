import type { SqlClient } from "@/lib/db/client";
import { getSql } from "@/lib/db/client";

export async function runMigrations(sql: SqlClient = getSql()): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS news_articles (
      id UUID PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      views INTEGER NOT NULL DEFAULT 0,
      published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_news_articles_published_at
    ON news_articles (published_at DESC)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name TEXT NOT NULL,
      company_name TEXT NOT NULL,
      business_email TEXT NOT NULL,
      interest TEXT NOT NULL,
      project_brief TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
    ON contact_submissions (created_at DESC)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      features JSONB NOT NULL DEFAULT '[]'::jsonb,
      icon TEXT NOT NULL DEFAULT 'clapperboard',
      published BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_products_sort_order
    ON products (sort_order ASC)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address_line TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      footer_tagline TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    ALTER TABLE site_settings
    ADD COLUMN IF NOT EXISTS facebook_url TEXT NOT NULL DEFAULT ''
  `;
  await sql`
    ALTER TABLE site_settings
    ADD COLUMN IF NOT EXISTS instagram_url TEXT NOT NULL DEFAULT ''
  `;
  await sql`
    ALTER TABLE site_settings
    ADD COLUMN IF NOT EXISTS x_url TEXT NOT NULL DEFAULT ''
  `;
  await sql`
    ALTER TABLE site_settings
    ADD COLUMN IF NOT EXISTS tiktok_url TEXT NOT NULL DEFAULT ''
  `;
  await sql`
    ALTER TABLE site_settings
    ADD COLUMN IF NOT EXISTS youtube_url TEXT NOT NULL DEFAULT ''
  `;
}
