import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound(): Promise<React.ReactElement> {
  const t = await getTranslations("common");

  return (
    <div className="section-container flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-3xl font-bold text-text-primary">{t("notFoundTitle")}</h1>
      <p className="mt-3 max-w-md text-text-secondary">{t("notFoundDescription")}</p>
      <Link href="/" className="btn-primary mt-8">
        {t("backHome")}
      </Link>
    </div>
  );
}
