import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { ProductDetail } from "@/components/products/product-detail";
import { getPublicProductBySlug } from "@/lib/cache/public-data";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  const t = await getTranslations("common");

  if (!product) {
    return { title: t("productNotFound") };
  }

  return {
    title: `${product.name} | Sepela Group`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-white pt-20">
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}
