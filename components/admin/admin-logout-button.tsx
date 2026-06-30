"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function AdminLogoutButton(): React.ReactElement {
  const router = useRouter();
  const t = useTranslations("admin");

  async function handleLogout(): Promise<void> {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      className="btn-outline px-4 py-2 text-xs"
    >
      {t("logout")}
    </button>
  );
}
