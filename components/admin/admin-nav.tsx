"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const ADMIN_LINKS = [
  { href: "/admin/news", labelKey: "news" },
  { href: "/admin/products", labelKey: "products" },
  { href: "/admin/contacts", labelKey: "contacts" },
  { href: "/admin/address", labelKey: "address" },
] as const;

export function AdminNav(): React.ReactElement {
  const t = useTranslations("admin");
  const nav = useTranslations("admin.nav");

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="section-container flex flex-wrap items-center justify-between gap-4 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">
            {t("brand")}
          </p>
          <h1 className="text-lg font-bold text-text-primary">{t("title")}</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher />
          {ADMIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="btn-outline px-4 py-2 text-xs"
            >
              {nav(link.labelKey)}
            </Link>
          ))}
          <Link href="/admin/news/new" className="btn-primary px-4 py-2 text-xs">
            {nav("newArticle")}
          </Link>
          <Link href="/admin/products/new" className="btn-primary px-4 py-2 text-xs">
            {nav("newProduct")}
          </Link>
          <AdminLogoutButton />
        </nav>
      </div>
    </div>
  );
}
