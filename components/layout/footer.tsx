import Link from "next/link";
import { Layers, Mail, MapPin, Phone } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

const QUICK_LINKS: readonly FooterLink[] = [
  { label: "Home", href: "/#home" },
  { label: "Products", href: "/#products" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Team", href: "/#team" },
  { label: "Contact", href: "/#contact" },
] as const;

const SERVICES: readonly FooterLink[] = [
  { label: "Custom Development", href: "/#capabilities" },
  { label: "Cloud Infrastructure", href: "/#capabilities" },
  { label: "Process Automation", href: "/#capabilities" },
  { label: "Enterprise Consulting", href: "/#contact" },
] as const;

export function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-primary text-white">
      <div className="section-container py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/#home" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Layers aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold">Sepela Group</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/80">
              Making your digital experience better with innovative enterprise
              solutions.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Services
            </h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {SERVICES.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              <li className="flex items-center gap-2.5 text-sm text-white/80">
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                info@sepela.group
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/80">
                <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
                +250 700 000 000
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/80">
                <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
                Kigali, Rwanda
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-6 text-sm text-white/70 sm:flex-row">
          <p>© {currentYear} Sepela Group. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
