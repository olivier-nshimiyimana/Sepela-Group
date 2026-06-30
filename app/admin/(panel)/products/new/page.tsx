import { getTranslations } from "next-intl/server";

import { ProductForm } from "@/components/admin/product-form";

export default async function AdminNewProductPage(): Promise<React.ReactElement> {
  const t = await getTranslations("admin.products");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-text-primary">{t("createPageTitle")}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t("createPageDescription")}</p>
      <div className="mt-8">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
