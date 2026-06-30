import { readFile } from "fs/promises";
import path from "path";

import { getSql } from "../lib/db/client";
import { runMigrations } from "../lib/db/migrate";
import { withConnectionRetries } from "../lib/db/retry";
import type { SiteSettings } from "../lib/settings/types";

async function seedDatabase(): Promise<void> {
  const sql = getSql({ forCli: true });
  await withConnectionRetries(() => runMigrations(sql));

  const existingNews = (await sql`
    SELECT COUNT(*)::text AS count
    FROM news_articles
  `) as Array<{ count: string }>;

  if (Number(existingNews[0]?.count ?? "0") === 0) {
    const seedPath = path.join(process.cwd(), "data", "news.json");
    const raw = await readFile(seedPath, "utf8");
    const store = JSON.parse(raw) as {
      articles: Array<Record<string, unknown>>;
    };

    for (const article of store.articles) {
      await sql`
        INSERT INTO news_articles (
          id, slug, title, excerpt, content, author, cover_image, images,
          published_at, views, published, created_at, updated_at
        )
        VALUES (
          ${article.id as string},
          ${article.slug as string},
          ${article.title as string},
          ${article.excerpt as string},
          ${article.content as string},
          ${article.author as string},
          ${article.coverImage as string},
          ${JSON.stringify(article.images)}::jsonb,
          ${article.publishedAt as string},
          ${article.views as number},
          ${article.published as boolean},
          ${article.createdAt as string},
          ${article.updatedAt as string}
        )
        ON CONFLICT (slug) DO NOTHING
      `;
    }

    console.log(`Seeded ${store.articles.length} news articles.`);
  } else {
    console.log("News articles already exist. Skipping news seed.");
  }

  const existingProducts = (await sql`
    SELECT COUNT(*)::text AS count
    FROM products
  `) as Array<{ count: string }>;

  const productsPath = path.join(process.cwd(), "data", "products.json");
  const productsRaw = await readFile(productsPath, "utf8");
  const productStore = JSON.parse(productsRaw) as {
    products: Array<Record<string, unknown>>;
  };

  let insertedProducts = 0;

  for (const product of productStore.products) {
    const rows = (await sql`
      INSERT INTO products (
        id, slug, name, tagline, description, content, cover_image, images,
        features, icon, published, sort_order, created_at, updated_at
      )
      VALUES (
        ${product.id as string},
        ${product.slug as string},
        ${product.name as string},
        ${product.tagline as string},
        ${product.description as string},
        ${product.content as string},
        ${product.coverImage as string},
        ${JSON.stringify(product.images)}::jsonb,
        ${JSON.stringify(product.features)}::jsonb,
        ${product.icon as string},
        ${product.published as boolean},
        ${product.sortOrder as number},
        ${product.createdAt as string},
        ${product.updatedAt as string}
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING slug
    `) as Array<{ slug: string }>;

    if (rows.length > 0) {
      insertedProducts += 1;
    }
  }

  if (insertedProducts > 0) {
    console.log(`Seeded ${insertedProducts} new product(s).`);
  } else if (Number(existingProducts[0]?.count ?? "0") === 0) {
    console.log("No products were inserted.");
  } else {
    console.log("All catalog products already exist. Skipping product seed.");
  }

  const settingsPath = path.join(process.cwd(), "data", "site-settings.json");
  const settingsRaw = await readFile(settingsPath, "utf8");
  const settings = JSON.parse(settingsRaw) as SiteSettings;

  await sql`
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
      ${settings.email},
      ${settings.phone},
      ${settings.addressLine},
      ${settings.city},
      ${settings.country},
      ${settings.footerTagline},
      ${settings.facebookUrl},
      ${settings.instagramUrl},
      ${settings.xUrl},
      ${settings.tiktokUrl},
      ${settings.youtubeUrl},
      ${settings.updatedAt}
    )
    ON CONFLICT (id) DO NOTHING
  `;

  console.log("Ensured default site settings exist.");
}

seedDatabase().catch((error: unknown) => {
  console.error("Database seed failed:", error);
  process.exit(1);
});
