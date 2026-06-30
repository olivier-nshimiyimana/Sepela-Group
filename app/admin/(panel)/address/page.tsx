import { getTranslations } from "next-intl/server";

import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/settings/storage";

export const dynamic = "force-dynamic";

export default async function AdminAddressPage(): Promise<React.ReactElement> {
  const settings = await getSiteSettings();
  const t = await getTranslations("admin.address");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-text-primary">{t("title")}</h2>
      <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      <div className="mt-8">
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
