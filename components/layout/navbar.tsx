"use client";

import Link from "next/link";
import { Layers, Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/#home" },
  { label: "Products", href: "/#products" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Team", href: "/#team" },
  { label: "Contact", href: "/#contact" },
] as const;

interface NavLinkProps {
  item: NavItem;
  onNavigate?: () => void;
  variant: "desktop" | "mobile";
}

function NavLink({
  item,
  onNavigate,
  variant,
}: NavLinkProps): React.ReactElement {
  const baseClasses =
    variant === "desktop" ? "nav-link-desktop" : "nav-link-mobile";

  return (
    <Link href={item.href} onClick={onNavigate} className={baseClasses}>
      <span className="nav-link-label">{item.label}</span>
      {variant === "desktop" ? (
        <span aria-hidden="true" className="nav-link-underline" />
      ) : null}
    </Link>
  );
}

export function Navbar(): React.ReactElement {
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <nav
        aria-label="Primary navigation"
        className="section-container flex h-16 items-center justify-between gap-4"
      >
        <Link
          href="/#home"
          onClick={closeMenu}
          className="flex items-center gap-2.5 transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-white shadow-md shadow-brand-primary/30">
            <Layers aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-bold text-brand-primary">
              Sepela
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-brand-primary/70">
              Group
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink item={item} variant="desktop" />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            onClick={closeMenu}
            className="btn-primary hidden px-5 py-2.5 text-xs sm:inline-flex"
          >
            Contact Us
          </Link>

          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-text-primary transition-colors duration-200 hover:border-brand-primary hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary lg:hidden"
          >
            {isOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 ease-in-out lg:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="section-container flex flex-col gap-1 py-4" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink
                item={item}
                variant="mobile"
                onNavigate={closeMenu}
              />
            </li>
          ))}
          <li className="pt-2">
            <Link
              href="/#contact"
              onClick={closeMenu}
              className="btn-primary w-full"
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
