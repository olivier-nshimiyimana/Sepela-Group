"use client";

import Link from "next/link";
import {
  Clapperboard,
  ShoppingCart,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  icon: LucideIcon;
  features: readonly string[];
}

const PRODUCTS: readonly Product[] = [
  {
    id: "cinema",
    name: "Sepela Cinema",
    tagline: "Media & Streaming Infrastructure",
    description:
      "End-to-end streaming platform with adaptive delivery, content management, and analytics built for broadcasters and OTT providers.",
    href: "/products/cinema",
    icon: Clapperboard,
    features: [
      "Adaptive bitrate streaming",
      "Multi-tenant content CMS",
      "Real-time audience analytics",
    ],
  },
  {
    id: "erp",
    name: "Sepela ERP",
    tagline: "Tax-Compliant POS & Retail",
    description:
      "Unified point-of-sale and inventory system with automated tax compliance, multi-branch sync, and regulatory reporting.",
    href: "/products/erp",
    icon: ShoppingCart,
    features: [
      "Automated tax compliance",
      "Multi-branch inventory sync",
      "Regulatory audit trails",
    ],
  },
  {
    id: "events",
    name: "Sepela Events",
    tagline: "Secure Digital Ticketing",
    description:
      "Fraud-resistant ticketing engine with dynamic QR validation, seat mapping, and real-time capacity management.",
    href: "/products/events",
    icon: Ticket,
    features: [
      "Cryptographic ticket validation",
      "Dynamic seat mapping",
      "Real-time capacity controls",
    ],
  },
] as const;

interface ProductCardProps {
  product: Product;
  isActive: boolean;
  onHover: () => void;
}

function ProductCard({
  product,
  isActive,
  onHover,
}: ProductCardProps): React.ReactElement {
  const Icon = product.icon;

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
        className={`text-xs font-semibold uppercase tracking-widest ${isActive ? "text-white/85" : ""}`}
        style={isActive ? undefined : { color: "var(--color-brand-primary)" }}
      >
        {product.tagline}
      </p>

      <h3
        className={`mt-2 text-xl font-bold sm:text-2xl ${isActive ? "text-white" : "text-text-primary"}`}
      >
        {product.name}
      </h3>

      <p
        className={`mt-3 flex-1 text-sm leading-relaxed ${isActive ? "text-white/90" : "text-text-secondary"}`}
      >
        {product.description}
      </p>

      <ul className="mt-5 flex flex-col gap-2" role="list">
        {product.features.map((feature) => (
          <li
            key={feature}
            className={`flex items-center gap-2 text-sm ${isActive ? "text-white/95" : "text-text-primary"}`}
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
        href={product.href}
        className={`mt-6 inline-flex items-center gap-1 text-sm font-semibold transition-colors ${isActive ? "text-white hover:text-white/85" : ""}`}
        style={isActive ? undefined : { color: "var(--color-brand-primary)" }}
      >
        Learn more
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

export function Products(): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="ai-section-bg py-20 sm:py-28"
    >
      <div className="section-container">
        <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <span className="section-eyebrow">Product Suite</span>
          <h2 id="products-heading" className="section-heading mt-2">
            Key Products
          </h2>
          <p className="section-description mt-4">
            Discover how our comprehensive suite of production applications
            revolutionizes media, retail, and event operations.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PRODUCTS.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isActive={activeIndex === index}
              onHover={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
