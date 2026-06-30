import { getTranslations } from "next-intl/server";

import { ProductsGrid } from "@/components/sections/products-grid";
import { getPublicProducts } from "@/lib/cache/public-data";

export async function Products(): Promise<React.ReactElement> {
  const products = await getPublicProducts();
  const t = await getTranslations("products");

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="ai-section-bg section-spacing"
    >
      <div className="section-container">
        <header className="section-header">
          <span className="section-eyebrow">{t("eyebrow")}</span>
          <h2 id="products-heading" className="section-heading mt-2">
            {t("heading")}
          </h2>
          <p className="section-description mt-4">{t("description")}</p>
        </header>

        {products.length > 0 ? (
          <ProductsGrid products={products} />
        ) : (
          <p className="text-center text-base font-medium text-text-secondary sm:text-sm sm:font-normal">{t("empty")}</p>
        )}
      </div>
    </section>
  );
}
