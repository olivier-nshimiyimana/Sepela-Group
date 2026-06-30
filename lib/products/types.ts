export type ProductIconKey =
  | "clapperboard"
  | "shopping-cart"
  | "ticket"
  | "vote"
  | "app-window"
  | "cloud"
  | "workflow";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  content: string;
  coverImage: string;
  images: string[];
  features: string[];
  icon: ProductIconKey;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  tagline: string;
  description: string;
  content: string;
  coverImage: string;
  images?: string[];
  features: string[];
  icon: ProductIconKey;
  published?: boolean;
  sortOrder?: number;
}
