import { z } from "zod";

export const newsArticleSchema = z.object({
  title: z.string().min(5, "validation.newsTitleMin").max(200),
  excerpt: z.string().min(20, "validation.newsExcerptMin").max(400),
  content: z.string().min(50, "validation.newsContentMin"),
  author: z.string().min(2, "validation.newsAuthorMin").max(100),
  coverImage: z.string().min(1, "validation.newsCoverRequired"),
  images: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(true),
});

export const newsUpdateSchema = newsArticleSchema.partial();

export type NewsArticleFormValues = z.infer<typeof newsArticleSchema>;
