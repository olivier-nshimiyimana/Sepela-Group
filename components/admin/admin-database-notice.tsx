import { getTranslations } from "next-intl/server";

import { getDatabaseStatusKey, isDatabaseReady } from "@/lib/db/resilience";

export async function AdminDatabaseNotice(): Promise<React.ReactElement | null> {
  await isDatabaseReady();
  const statusKey = getDatabaseStatusKey();
  const t = await getTranslations("admin.database");

  if (!statusKey) {
    return null;
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="section-container py-3">
        <p className="text-sm text-amber-900">
          <strong>{t("notice")}</strong> {t(statusKey)}
        </p>
      </div>
    </div>
  );
}
