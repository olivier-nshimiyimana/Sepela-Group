"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Link } from "@/i18n/navigation";

const COMPANY_LOGO_SRC = "/sepela-logo.png";

interface NavItem {
  labelKey: "home" | "products" | "capabilities" | "team" | "news" | "contact";
  href: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: "home", href: "/#home" },
  { labelKey: "products", href: "/#products" },
  { labelKey: "capabilities", href: "/#capabilities" },
  { labelKey: "team", href: "/#team" },
  { labelKey: "news", href: "/#news" },
  { labelKey: "contact", href: "/#contact" },
] as const;

interface NavLinkProps {
  item: NavItem;
  label: string;
  onNavigate?: () => void;
  variant: "desktop" | "mobile";
}

function NavLink({
  item,
  label,
  onNavigate,
  variant,
}: NavLinkProps): React.ReactElement {
  const baseClasses =
    variant === "desktop" ? "nav-link-desktop" : "nav-link-mobile";

  return (
    <Link href={item.href} onClick={onNavigate} className={baseClasses}>
      <span className="nav-link-label">{label}</span>
      {variant === "desktop" ? (
        <span aria-hidden="true" className="nav-link-underline" />
      ) : null}
    </Link>
  );
}

export function Navbar(): React.ReactElement {
  const t = useTranslations("nav");
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeMenu]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <nav
          aria-label={t("primary")}
          className="section-container flex h-20 items-center justify-between gap-4"
        >
        <Link
          href="/#home"
          onClick={closeMenu}
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
        >
          <Image
            src={COMPANY_LOGO_SRC}
            alt={t("logoAlt")}
            width={128}
            height={128}
            priority
            className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold tracking-tight text-brand-primary sm:text-xl sm:font-bold">
              Sepela
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary/80 sm:text-xs sm:font-semibold sm:text-brand-primary/70">
              Group
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                label={t(item.labelKey)}
                variant="desktop"
              />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Link
            href="/#contact"
            onClick={closeMenu}
            className="btn-primary hidden px-5 py-2.5 text-xs sm:inline-flex"
          >
            {t("contactUs")}
          </Link>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? t("closeMenu") : t("openMenu")}
            onClick={toggleMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-text-primary transition-colors duration-200 hover:border-brand-primary hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary lg:hidden"
          >
            {isOpen ? (
              <X aria-hidden="true" className="h-6 w-6" />
            ) : (
              <Menu aria-hidden="true" className="h-6 w-6" />
            )}
          </button>
        </div>
        </nav>

        <div
          id="mobile-menu"
          aria-hidden={!isOpen}
          className={`border-t border-gray-100 bg-white shadow-lg transition-[max-height,opacity] duration-300 ease-in-out lg:hidden ${
            isOpen
              ? "max-h-[calc(100svh-5rem)] opacity-100"
              : "pointer-events-none max-h-0 overflow-hidden opacity-0"
          }`}
        >
          <ul
            className="section-container flex max-h-[calc(100svh-5rem)] flex-col gap-1 overflow-y-auto overscroll-contain py-4 pb-8"
            role="list"
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  label={t(item.labelKey)}
                  variant="mobile"
                  onNavigate={closeMenu}
                />
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/#contact"
                onClick={closeMenu}
                className="btn-primary w-full"
              >
                {t("contactUs")}
              </Link>
            </li>
          </ul>
        </div>
      </header>

      {isOpen ? (
        <button
          type="button"
          aria-label={t("closeMenu")}
          className="fixed inset-0 top-20 z-40 bg-slate-900/40 lg:hidden"
          onClick={closeMenu}
        />
      ) : null}
    </>
  );
}
