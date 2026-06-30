import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { SocialLinks } from "@/components/layout/social-links";
import { Link } from "@/i18n/navigation";
import { getActiveSocialLinks } from "@/lib/settings/social";
import { getPublicSiteSettings } from "@/lib/cache/public-data";

export async function Footer(): Promise<React.ReactElement> {
  const settings = await getPublicSiteSettings();
  const socialLinks = getActiveSocialLinks(settings);
  const currentYear = new Date().getFullYear();
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  const quickLinks = [
    { label: nav("home"), href: "/#home" },
    { label: nav("products"), href: "/#products" },
    { label: nav("capabilities"), href: "/#capabilities" },
    { label: nav("team"), href: "/#team" },
    { label: nav("news"), href: "/#news" },
    { label: nav("contact"), href: "/#contact" },
  ] as const;

  const services = [
    { label: t("customDevelopment"), href: "/#capabilities" },
    { label: t("cloudInfrastructure"), href: "/#capabilities" },
    { label: t("processAutomation"), href: "/#capabilities" },
    { label: t("enterpriseConsulting"), href: "/#contact" },
  ] as const;

  return (
    <footer className="bg-brand-primary text-white">
      <div className="section-container py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/#home" className="flex items-center gap-3">
              <Image
                src="/sepela-logo.png"
                alt={t("logoAlt")}
                width={128}
                height={128}
                className="h-14 w-14 shrink-0 object-contain"
              />
              <span className="text-xl font-extrabold sm:text-lg sm:font-bold">Sepela Group</span>
            </Link>
            <p className="text-base font-medium leading-relaxed text-white/90 sm:text-sm sm:font-normal sm:text-white/80">
              {settings.footerTagline}
            </p>
            <SocialLinks links={socialLinks} className="mt-2" />
          </div>

          <div>
            <h3 className="mb-4 text-base font-extrabold uppercase tracking-wider sm:text-sm sm:font-semibold">
              {t("quickLinks")}
            </h3>
            <ul className="flex flex-col gap-3 sm:gap-2.5" role="list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base font-medium text-white/90 transition-colors hover:text-white sm:text-sm sm:font-normal sm:text-white/80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-extrabold uppercase tracking-wider sm:text-sm sm:font-semibold">
              {t("services")}
            </h3>
            <ul className="flex flex-col gap-3 sm:gap-2.5" role="list">
              {services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-base font-medium text-white/90 transition-colors hover:text-white sm:text-sm sm:font-normal sm:text-white/80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-extrabold uppercase tracking-wider sm:text-sm sm:font-semibold">
              {t("contactUs")}
            </h3>
            <ul className="flex flex-col gap-3.5 sm:gap-3" role="list">
              <li className="flex items-center gap-3 text-base font-medium text-white/90 sm:gap-2.5 sm:text-sm sm:text-white/80">
                <Mail aria-hidden="true" className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
                {settings.email}
              </li>
              <li className="flex items-center gap-3 text-base font-medium text-white/90 sm:gap-2.5 sm:text-sm sm:text-white/80">
                <Phone aria-hidden="true" className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
                {settings.phone}
              </li>
              <li className="flex items-center gap-3 text-base font-medium text-white/90 sm:gap-2.5 sm:text-sm sm:text-white/80">
                <MapPin aria-hidden="true" className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
                {settings.addressLine}, {settings.city}, {settings.country}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-6 text-base font-medium text-white/85 sm:flex-row sm:text-sm sm:text-white/70">
          <p>{t("rights", { year: currentYear })}</p>
          <div className="flex gap-6">
            <Link href="#" className="font-semibold transition-colors hover:text-white sm:font-normal">
              {t("privacy")}
            </Link>
            <Link href="#" className="font-semibold transition-colors hover:text-white sm:font-normal">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
