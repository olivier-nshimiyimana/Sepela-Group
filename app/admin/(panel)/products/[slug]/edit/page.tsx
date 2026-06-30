import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { ProductForm } from "@/components/admin/product-form";
import { getProductBySlug } from "@/lib/products/storage";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const product = await getProductBySlug(slug, true);
  const t = await getTranslations("admin.products");

  if (!product) {
    notFound();
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-text-primary">{t("editPageTitle")}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t("editPageDescription")}</p>
      <div className="mt-8">
        <ProductForm mode="edit" initialProduct={product} />
      </div>
    </div>
  );
}
