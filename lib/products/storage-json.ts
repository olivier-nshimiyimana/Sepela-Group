import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

import type { Product, ProductInput } from "@/lib/products/types";
import { createUniqueSlug } from "@/lib/news/utils";

const DATA_FILE = path.join(process.cwd(), "data", "products.json");

interface ProductStore {
  products: Product[];
}

async function readStore(): Promise<ProductStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as ProductStore;
  } catch {
    return { products: [] };
  }
}

async function writeStore(store: ProductStore): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

function sortProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAllProductsFromJson(
  includeUnpublished = false,
): Promise<Product[]> {
  const store = await readStore();
  const products = includeUnpublished
    ? store.products
    : store.products.filter((product) => product.published);

  return sortProducts(products);
}

export async function getProductBySlugFromJson(
  slug: string,
  includeUnpublished = false,
): Promise<Product | null> {
  const store = await readStore();
  const product = store.products.find((item) => item.slug === slug);

  if (!product || (!includeUnpublished && !product.published)) {
    return null;
  }

  return product;
}

export async function createProductInJson(input: ProductInput): Promise<Product> {
  const store = await readStore();
  const now = new Date().toISOString();
  const slug = createUniqueSlug(
    input.name,
    store.products.map((product) => product.slug),
  );

  const product: Product = {
    id: randomUUID(),
    slug,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    content: input.content,
    coverImage: input.coverImage,
    images: input.images ?? [],
    features: input.features,
    icon: input.icon,
    published: input.published ?? true,
    sortOrder: input.sortOrder ?? store.products.length + 1,
    createdAt: now,
    updatedAt: now,
  };

  store.products.push(product);
  await writeStore(store);

  return product;
}

export async function updateProductInJson(
  slug: string,
  input: Partial<ProductInput>,
): Promise<Product | null> {
  const store = await readStore();
  const index = store.products.findIndex((product) => product.slug === slug);

  if (index === -1) {
    return null;
  }

  const current = store.products[index];
  const updated: Product = {
    ...current,
    ...input,
    images: input.images ?? current.images,
    features: input.features ?? current.features,
    updatedAt: new Date().toISOString(),
  };

  store.products[index] = updated;
  await writeStore(store);

  return updated;
}

export async function deleteProductFromJson(slug: string): Promise<boolean> {
  const store = await readStore();
  const nextProducts = store.products.filter((product) => product.slug !== slug);

  if (nextProducts.length === store.products.length) {
    return false;
  }

  store.products = nextProducts;
  await writeStore(store);

  return true;
}
