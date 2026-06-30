"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { getProductIcon } from "@/lib/products/icons";
import type { Product } from "@/lib/products/types";
import { Link } from "@/i18n/navigation";

interface ProductsGridProps {
  products: Product[];
}

interface ProductCardProps {
  product: Product;
  isActive: boolean;
  onHover: () => void;
}

function ProductCard({
  product,
  isActive,
  onHover,
  learnMoreLabel,
}: ProductCardProps & { learnMoreLabel: string }): React.ReactElement {
  const Icon = getProductIcon(product.icon);

  return (
    <article
      onMouseEnter={onHover}
      onFocus={onHover}
      className={`feature-card group ${isActive ? "feature-card-active" : ""}`}
    >
      <div className={`ai-icon-wrap ${isActive ? "ai-icon-wrap-active" : ""}`}>
        <span aria-hidden="true" className="ai-icon-glow" />
        <Icon aria-hidden="true" className="relative h-6 w-6" />
      </div>

      <p
        className={`card-eyebrow ${isActive ? "text-white/90" : ""}`}
        style={isActive ? undefined : { color: "var(--color-brand-primary)" }}
      >
        {product.tagline}
      </p>

      <h3
        className={`card-title mt-2 ${isActive ? "text-white" : ""}`}
      >
        {product.name}
      </h3>

      <p
        className={`card-body mt-3 flex-1 ${isActive ? "text-white/95" : ""}`}
      >
        {product.description}
      </p>

      <ul className="mt-5 flex flex-col gap-2.5 sm:gap-2" role="list">
        {product.features.map((feature) => (
          <li
            key={feature}
            className={`card-list-item ${isActive ? "text-white" : ""}`}
          >
            <span
              aria-hidden="true"
              className={`ai-feature-dot ${isActive ? "ai-feature-dot-active" : ""}`}
            />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={`/products/${product.slug}`}
        className={`mt-6 inline-flex min-h-11 items-center gap-1.5 text-base font-bold transition-colors sm:min-h-0 sm:text-sm sm:font-semibold ${isActive ? "text-white hover:text-white/85" : ""}`}
        style={isActive ? undefined : { color: "var(--color-brand-primary)" }}
      >
        {learnMoreLabel}
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </article>
  );
}

export function ProductsGrid({ products }: ProductsGridProps): React.ReactElement {
  const t = useTranslations("products");
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          isActive={activeIndex === index}
          onHover={() => setActiveIndex(index)}
          learnMoreLabel={t("learnMore")}
        />
      ))}
    </div>
  );
}
