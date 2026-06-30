export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  images: string[];
  publishedAt: string;
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticleInput {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  images?: string[];
  published?: boolean;
}

export interface NewsStore {
  articles: NewsArticle[];
}
