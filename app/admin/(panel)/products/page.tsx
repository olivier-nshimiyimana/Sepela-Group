import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { getAllProducts } from "@/lib/products/storage";
import { Link as LocaleLink } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage(): Promise<React.ReactElement> {
  const products = await getAllProducts(true);
  const t = await getTranslations("admin.products");
  const status = await getTranslations("admin.status");
  const actions = await getTranslations("admin.actions");
  const nav = await getTranslations("admin.nav");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{t("listTitle")}</h2>
          <p className="mt-1 text-sm text-text-secondary">{t("listDescription")}</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary px-5 py-2.5 text-xs">
          {nav("newProduct")}
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 text-text-secondary">
            <tr>
              <th className="px-3 py-3 font-semibold">{t("tableName")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableOrder")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableStatus")}</th>
              <th className="px-3 py-3 font-semibold">{t("tableActions")}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-50">
                <td className="px-3 py-4 font-medium text-text-primary">
                  {product.name}
                </td>
                <td className="px-3 py-4 text-text-secondary">{product.sortOrder}</td>
                <td className="px-3 py-4">
                  <span
                    className={
                      product.published
                        ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700"
                        : "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
                    }
                  >
                    {product.published ? status("published") : status("draft")}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/products/${product.slug}/edit`}
                      className="text-brand-primary hover:underline"
                    >
                      {actions("edit")}
                    </Link>
                    <LocaleLink
                      href={`/products/${product.slug}`}
                      className="text-text-secondary hover:text-brand-primary"
                    >
                      {actions("view")}
                    </LocaleLink>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 ? (
          <p className="py-10 text-center text-text-secondary">{t("empty")}</p>
        ) : null}
      </div>
    </div>
  );
}
