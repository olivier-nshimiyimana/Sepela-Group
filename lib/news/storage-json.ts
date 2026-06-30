import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

import type { NewsArticle, NewsArticleInput, NewsStore } from "@/lib/news/types";
import { createUniqueSlug } from "@/lib/news/utils";

const DATA_DIR = path.join(process.cwd(), "data");
const NEWS_FILE = path.join(DATA_DIR, "news.json");

async function ensureNewsFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(NEWS_FILE);
  } catch {
    const emptyStore: NewsStore = { articles: [] };
    await fs.writeFile(NEWS_FILE, JSON.stringify(emptyStore, null, 2), "utf8");
  }
}

async function readStore(): Promise<NewsStore> {
  await ensureNewsFile();
  const raw = await fs.readFile(NEWS_FILE, "utf8");
  return JSON.parse(raw) as NewsStore;
}

async function writeStore(store: NewsStore): Promise<void> {
  await ensureNewsFile();
  await fs.writeFile(NEWS_FILE, JSON.stringify(store, null, 2), "utf8");
}

function sortArticles(articles: NewsArticle[]): NewsArticle[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getAllArticlesFromJson(
  includeUnpublished = false,
): Promise<NewsArticle[]> {
  const store = await readStore();
  const articles = includeUnpublished
    ? store.articles
    : store.articles.filter((article) => article.published);

  return sortArticles(articles);
}

export async function getArticleBySlugFromJson(
  slug: string,
  includeUnpublished = false,
): Promise<NewsArticle | null> {
  const store = await readStore();
  const article = store.articles.find((item) => item.slug === slug);

  if (!article || (!includeUnpublished && !article.published)) {
    return null;
  }

  return article;
}

export async function createArticleInJson(
  input: NewsArticleInput,
): Promise<NewsArticle> {
  const store = await readStore();
  const now = new Date().toISOString();
  const slug = createUniqueSlug(
    input.title,
    store.articles.map((article) => article.slug),
  );

  const article: NewsArticle = {
    id: randomUUID(),
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    author: input.author,
    coverImage: input.coverImage,
    images: input.images ?? [],
    publishedAt: now,
    views: 0,
    published: input.published ?? true,
    createdAt: now,
    updatedAt: now,
  };

  store.articles.push(article);
  await writeStore(store);

  return article;
}

export async function updateArticleInJson(
  slug: string,
  input: Partial<NewsArticleInput>,
): Promise<NewsArticle | null> {
  const store = await readStore();
  const index = store.articles.findIndex((article) => article.slug === slug);

  if (index === -1) {
    return null;
  }

  const current = store.articles[index];
  const updated: NewsArticle = {
    ...current,
    ...input,
    images: input.images ?? current.images,
    updatedAt: new Date().toISOString(),
  };

  store.articles[index] = updated;
  await writeStore(store);

  return updated;
}

export async function deleteArticleFromJson(slug: string): Promise<boolean> {
  const store = await readStore();
  const nextArticles = store.articles.filter((article) => article.slug !== slug);

  if (nextArticles.length === store.articles.length) {
    return false;
  }

  store.articles = nextArticles;
  await writeStore(store);

  return true;
}

export async function incrementArticleViewsInJson(slug: string): Promise<void> {
  const store = await readStore();
  const index = store.articles.findIndex((article) => article.slug === slug);

  if (index === -1) {
    return;
  }

  store.articles[index] = {
    ...store.articles[index],
    views: store.articles[index].views + 1,
  };

  await writeStore(store);
}
