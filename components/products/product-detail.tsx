import Image from "next/image";
import { ChevronRight, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getProductIcon } from "@/lib/products/icons";
import type { Product } from "@/lib/products/types";
import { Link } from "@/i18n/navigation";

interface ProductDetailProps {
  product: Product;
}

export async function ProductDetail({
  product,
}: ProductDetailProps): Promise<React.ReactElement> {
  const t = await getTranslations("products");
  const common = await getTranslations("common");
  const Icon = getProductIcon(product.icon);
  const paragraphs = product.content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const galleryImages = [product.coverImage, ...product.images].filter(
    (image, index, array) => array.indexOf(image) === index,
  );

  return (
    <div className="section-container py-10 sm:py-14">
      <nav
        aria-label={common("breadcrumb")}
        className="mb-8 flex flex-wrap items-center gap-2 text-base font-medium text-text-secondary sm:text-sm sm:font-normal"
      >
        <Link href="/" className="inline-flex items-center gap-1 hover:text-brand-primary">
          <Home aria-hidden="true" className="h-4 w-4" />
          {t("breadcrumbHome")}
        </Link>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
        <Link href="/#products" className="hover:text-brand-primary">
          {t("breadcrumbProducts")}
        </Link>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
        <span className="line-clamp-1 font-semibold text-text-primary sm:font-normal">{product.name}</span>
      </nav>

      <article className="news-article-panel">
        <div className="flex items-start gap-4">
          <div className="ai-icon-wrap">
            <Icon aria-hidden="true" className="relative h-7 w-7" />
          </div>
          <div>
            <p className="section-eyebrow">{product.tagline}</p>
            <h1 className="section-heading-dark mt-2">
              {product.name}
            </h1>
            <p className="section-description mt-4 max-w-3xl">
              {product.description}
            </p>
          </div>
        </div>

        <div className="product-gallery-frame">
          <Image
            src={product.coverImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 760px"
            className="product-gallery-image"
          />
        </div>

        <div className="news-article-content">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2" role="list">
          {product.features.map((feature) => (
            <li
              key={feature}
              className="card-list-item rounded-xl border border-gray-100 bg-brand-muted px-4 py-3.5 sm:py-3"
            >
              <span aria-hidden="true" className="ai-feature-dot" />
              {feature}
            </li>
          ))}
        </ul>

        {galleryImages.length > 1 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {galleryImages.slice(1).map((image) => (
              <div key={image} className="product-gallery-frame">
                <Image
                  src={image}
                  alt={t("galleryAlt", { name: product.name })}
                  fill
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="product-gallery-image"
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/#contact" className="btn-primary">
            {t("contactSales")}
          </Link>
          <Link href="/#products" className="btn-outline">
            {t("backToProducts")}
          </Link>
        </div>
      </article>
    </div>
  );
}
