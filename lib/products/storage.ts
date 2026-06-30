import { randomUUID } from "crypto";

import { getSql } from "@/lib/db/client";
import { mapProductRow, type ProductRow } from "@/lib/db/mappers";
import { withDatabaseRead, withDatabaseWrite } from "@/lib/db/resilience";
import { createUniqueSlug } from "@/lib/news/utils";
import type { Product, ProductInput } from "@/lib/products/types";
import {
  createProductInJson,
  deleteProductFromJson,
  getAllProductsFromJson,
  getProductBySlugFromJson,
  updateProductInJson,
} from "@/lib/products/storage-json";

export async function getAllProducts(
  includeUnpublished = false,
): Promise<Product[]> {
  return withDatabaseRead(
    async () => {
      const sql = getSql();
      const rows = (includeUnpublished
        ? await sql`
            SELECT *
            FROM products
            ORDER BY sort_order ASC, created_at ASC
          `
        : await sql`
            SELECT *
            FROM products
            WHERE published = TRUE
            ORDER BY sort_order ASC, created_at ASC
          `) as ProductRow[];

      return rows.map(mapProductRow);
    },
    () => getAllProductsFromJson(includeUnpublished),
  );
}

export async function getProductBySlug(
  slug: string,
  includeUnpublished = false,
): Promise<Product | null> {
  return withDatabaseRead(
    async () => {
      const sql = getSql();
      const rows = (includeUnpublished
        ? await sql`
            SELECT *
            FROM products
            WHERE slug = ${slug}
            LIMIT 1
          `
        : await sql`
            SELECT *
            FROM products
            WHERE slug = ${slug}
              AND published = TRUE
            LIMIT 1
          `) as ProductRow[];

      const row = rows[0];
      return row ? mapProductRow(row) : null;
    },
    () => getProductBySlugFromJson(slug, includeUnpublished),
  );
}

export async function createProduct(input: ProductInput): Promise<Product> {
  return withDatabaseWrite(
    async () => {
      const sql = getSql();
      const existingRows = (await sql`
        SELECT slug
        FROM products
      `) as Array<{ slug: string }>;
      const now = new Date().toISOString();
      const id = randomUUID();
      const slug = createUniqueSlug(
        input.name,
        existingRows.map((row) => row.slug),
      );

      const rows = (await sql`
        INSERT INTO products (
          id,
          slug,
          name,
          tagline,
          description,
          content,
          cover_image,
          images,
          features,
          icon,
          published,
          sort_order,
          created_at,
          updated_at
        )
        VALUES (
          ${id},
          ${slug},
          ${input.name},
          ${input.tagline},
          ${input.description},
          ${input.content},
          ${input.coverImage},
          ${JSON.stringify(input.images ?? [])}::jsonb,
          ${JSON.stringify(input.features)}::jsonb,
          ${input.icon},
          ${input.published ?? true},
          ${input.sortOrder ?? existingRows.length + 1},
          ${now},
          ${now}
        )
        RETURNING *
      `) as ProductRow[];

      const row = rows[0];
      if (!row) {
        throw new Error("Failed to create product.");
      }

      return mapProductRow(row);
    },
    () => createProductInJson(input),
  );
}

export async function updateProduct(
  slug: string,
  input: Partial<ProductInput>,
): Promise<Product | null> {
  return withDatabaseWrite(
    async () => {
      const current = await getProductBySlug(slug, true);
      if (!current) {
        return null;
      }

      const sql = getSql();
      const updatedAt = new Date().toISOString();

      const rows = (await sql`
        UPDATE products
        SET
          name = ${input.name ?? current.name},
          tagline = ${input.tagline ?? current.tagline},
          description = ${input.description ?? current.description},
          content = ${input.content ?? current.content},
          cover_image = ${input.coverImage ?? current.coverImage},
          images = ${JSON.stringify(input.images ?? current.images)}::jsonb,
          features = ${JSON.stringify(input.features ?? current.features)}::jsonb,
          icon = ${input.icon ?? current.icon},
          published = ${input.published ?? current.published},
          sort_order = ${input.sortOrder ?? current.sortOrder},
          updated_at = ${updatedAt}
        WHERE slug = ${slug}
        RETURNING *
      `) as ProductRow[];

      const row = rows[0];
      return row ? mapProductRow(row) : null;
    },
    () => updateProductInJson(slug, input),
  );
}

export async function deleteProduct(slug: string): Promise<boolean> {
  return withDatabaseWrite(
    async () => {
      const sql = getSql();
      const rows = (await sql`
        DELETE FROM products
        WHERE slug = ${slug}
        RETURNING id
      `) as Array<{ id: string }>;

      return rows.length > 0;
    },
    () => deleteProductFromJson(slug),
  );
}
