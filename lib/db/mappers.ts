import type { NewsArticle } from "@/lib/news/types";
import type { Product, ProductIconKey } from "@/lib/products/types";
import type { SiteSettings } from "@/lib/settings/types";

export interface NewsArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  cover_image: string;
  images: string[] | string;
  published_at: string | Date;
  views: number;
  published: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

function toIsoString(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function parseImages(value: string[] | string): string[] {
  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function mapNewsArticleRow(row: NewsArticleRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    coverImage: row.cover_image,
    images: parseImages(row.images),
    publishedAt: toIsoString(row.published_at),
    views: row.views,
    published: row.published,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  content: string;
  cover_image: string;
  images: string[] | string;
  features: string[] | string;
  icon: string;
  published: boolean;
  sort_order: number;
  created_at: string | Date;
  updated_at: string | Date;
}

function parseStringArray(value: string[] | string): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    content: row.content,
    coverImage: row.cover_image,
    images: parseStringArray(row.images),
    features: parseStringArray(row.features),
    icon: row.icon as ProductIconKey,
    published: row.published,
    sortOrder: row.sort_order,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

export interface SiteSettingsRow {
  email: string;
  phone: string;
  address_line: string;
  city: string;
  country: string;
  footer_tagline: string;
  facebook_url?: string;
  instagram_url?: string;
  x_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  updated_at: string | Date;
}

export function mapSiteSettingsRow(row: SiteSettingsRow): SiteSettings {
  return {
    email: row.email,
    phone: row.phone,
    addressLine: row.address_line,
    city: row.city,
    country: row.country,
    footerTagline: row.footer_tagline,
    facebookUrl: row.facebook_url ?? "",
    instagramUrl: row.instagram_url ?? "",
    xUrl: row.x_url ?? "",
    tiktokUrl: row.tiktok_url ?? "",
    youtubeUrl: row.youtube_url ?? "",
    updatedAt: toIsoString(row.updated_at),
  };
}

export interface ContactSubmissionRow {
  id: string;
  full_name: string;
  company_name: string;
  business_email: string;
  interest: string;
  project_brief: string;
  created_at: string | Date;
}

export interface ContactSubmission {
  id: string;
  fullName: string;
  companyName: string;
  businessEmail: string;
  interest: string;
  projectBrief: string;
  createdAt: string;
}

export function mapContactSubmissionRow(
  row: ContactSubmissionRow,
): ContactSubmission {
  return {
    id: row.id,
    fullName: row.full_name,
    companyName: row.company_name,
    businessEmail: row.business_email,
    interest: row.interest,
    projectBrief: row.project_brief,
    createdAt: toIsoString(row.created_at),
  };
}
