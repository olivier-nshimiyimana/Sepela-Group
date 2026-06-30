import { unstable_cache } from "next/cache";

import { getAllArticles, getArticleBySlug } from "@/lib/news/storage";
import { getAllProducts, getProductBySlug } from "@/lib/products/storage";
import { getSiteSettings } from "@/lib/settings/storage";

export const CACHE_TAGS = {
  products: "public-products",
  news: "public-news",
  settings: "public-settings",
} as const;

const REVALIDATE_SECONDS = 60;

export const getPublicProducts = unstable_cache(
  async () => getAllProducts(false),
  ["public-products-list"],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] },
);

export const getPublicProductBySlug = (slug: string) =>
  unstable_cache(
    async () => getProductBySlug(slug, false),
    ["public-product", slug],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.products] },
  )();

export const getPublicArticles = unstable_cache(
  async () => getAllArticles(false),
  ["public-news-list"],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.news] },
);

export const getPublicArticleBySlug = (slug: string) =>
  unstable_cache(
    async () => getArticleBySlug(slug, false),
    ["public-article", slug],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.news] },
  )();

export const getPublicSiteSettings = unstable_cache(
  async () => getSiteSettings(),
  ["public-site-settings"],
  { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.settings] },
);
