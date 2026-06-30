import Link from "next/link";

import { DevOverlayHide } from "@/components/dev-overlay-hide";
import { getMessage } from "@/lib/i18n/message";

import "./globals.css";

export default function RootNotFound(): React.ReactElement {
  const t = (key: string) => getMessage("fr", `common.${key}`);

  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center font-sans">
        <DevOverlayHide />
        <h1 className="text-3xl font-bold text-gray-900">{t("notFoundTitle")}</h1>
        <p className="mt-3 max-w-md text-gray-600">{t("notFoundDescription")}</p>
        <p className="mt-6 max-w-md text-sm text-gray-500">
          {t("adminRouteHint")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/fr"
            className="inline-flex rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white"
          >
            {t("backHome")}
          </Link>
          <Link
            href="/admin"
            className="inline-flex rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700"
          >
            {t("adminPanel")}
          </Link>
        </div>
      </body>
    </html>
  );
}
