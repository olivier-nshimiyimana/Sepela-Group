import { randomUUID } from "crypto";

import { getSql } from "@/lib/db/client";
import { mapNewsArticleRow, type NewsArticleRow } from "@/lib/db/mappers";
import { withDatabaseRead, withDatabaseWrite } from "@/lib/db/resilience";
import type { NewsArticle, NewsArticleInput } from "@/lib/news/types";
import { createUniqueSlug } from "@/lib/news/utils";
import {
  createArticleInJson,
  deleteArticleFromJson,
  getAllArticlesFromJson,
  getArticleBySlugFromJson,
  incrementArticleViewsInJson,
  updateArticleInJson,
} from "@/lib/news/storage-json";

export async function getAllArticles(
  includeUnpublished = false,
): Promise<NewsArticle[]> {
  return withDatabaseRead(
    async () => {
      const sql = getSql();
      const rows = (includeUnpublished
        ? await sql`
            SELECT *
            FROM news_articles
            ORDER BY published_at DESC
          `
        : await sql`
            SELECT *
            FROM news_articles
            WHERE published = TRUE
            ORDER BY published_at DESC
          `) as NewsArticleRow[];

      return rows.map(mapNewsArticleRow);
    },
    () => getAllArticlesFromJson(includeUnpublished),
  );
}

export async function getArticleBySlug(
  slug: string,
  includeUnpublished = false,
): Promise<NewsArticle | null> {
  return withDatabaseRead(
    async () => {
      const sql = getSql();
      const rows = (includeUnpublished
        ? await sql`
            SELECT *
            FROM news_articles
            WHERE slug = ${slug}
            LIMIT 1
          `
        : await sql`
            SELECT *
            FROM news_articles
            WHERE slug = ${slug}
              AND published = TRUE
            LIMIT 1
          `) as NewsArticleRow[];

      const row = rows[0];
      return row ? mapNewsArticleRow(row) : null;
    },
    () => getArticleBySlugFromJson(slug, includeUnpublished),
  );
}

export async function createArticle(
  input: NewsArticleInput,
): Promise<NewsArticle> {
  return withDatabaseWrite(
    async () => {
      const sql = getSql();
      const existingRows = (await sql`
        SELECT slug
        FROM news_articles
      `) as Array<{ slug: string }>;
      const now = new Date().toISOString();
      const id = randomUUID();
      const slug = createUniqueSlug(
        input.title,
        existingRows.map((row) => row.slug),
      );
      const images = input.images ?? [];
      const published = input.published ?? true;

      const rows = (await sql`
        INSERT INTO news_articles (
          id,
          slug,
          title,
          excerpt,
          content,
          author,
          cover_image,
          images,
          published_at,
          views,
          published,
          created_at,
          updated_at
        )
        VALUES (
          ${id},
          ${slug},
          ${input.title},
          ${input.excerpt},
          ${input.content},
          ${input.author},
          ${input.coverImage},
          ${JSON.stringify(images)}::jsonb,
          ${now},
          0,
          ${published},
          ${now},
          ${now}
        )
        RETURNING *
      `) as NewsArticleRow[];

      const row = rows[0];
      if (!row) {
        throw new Error("Failed to create news article.");
      }

      return mapNewsArticleRow(row);
    },
    () => createArticleInJson(input),
  );
}

export async function updateArticle(
  slug: string,
  input: Partial<NewsArticleInput>,
): Promise<NewsArticle | null> {
  return withDatabaseWrite(
    async () => {
      const current = await getArticleBySlug(slug, true);
      if (!current) {
        return null;
      }

      const sql = getSql();
      const updatedAt = new Date().toISOString();
      const nextImages = input.images ?? current.images;

      const rows = (await sql`
        UPDATE news_articles
        SET
          title = ${input.title ?? current.title},
          excerpt = ${input.excerpt ?? current.excerpt},
          content = ${input.content ?? current.content},
          author = ${input.author ?? current.author},
          cover_image = ${input.coverImage ?? current.coverImage},
          images = ${JSON.stringify(nextImages)}::jsonb,
          published = ${input.published ?? current.published},
          updated_at = ${updatedAt}
        WHERE slug = ${slug}
        RETURNING *
      `) as NewsArticleRow[];

      const row = rows[0];
      return row ? mapNewsArticleRow(row) : null;
    },
    () => updateArticleInJson(slug, input),
  );
}

export async function deleteArticle(slug: string): Promise<boolean> {
  return withDatabaseWrite(
    async () => {
      const sql = getSql();
      const rows = (await sql`
        DELETE FROM news_articles
        WHERE slug = ${slug}
        RETURNING id
      `) as Array<{ id: string }>;

      return rows.length > 0;
    },
    () => deleteArticleFromJson(slug),
  );
}

export async function incrementArticleViews(slug: string): Promise<void> {
  try {
    await withDatabaseWrite(async () => {
      const sql = getSql();
      await sql`
        UPDATE news_articles
        SET views = views + 1
        WHERE slug = ${slug}
      `;
    });
  } catch {
    await incrementArticleViewsInJson(slug);
  }
}
