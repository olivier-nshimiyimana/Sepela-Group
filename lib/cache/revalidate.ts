import { revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache/public-data";

export function revalidatePublicProducts(): void {
  revalidateTag(CACHE_TAGS.products);
}

export function revalidatePublicNews(): void {
  revalidateTag(CACHE_TAGS.news);
}

export function revalidatePublicSettings(): void {
  revalidateTag(CACHE_TAGS.settings);
}
