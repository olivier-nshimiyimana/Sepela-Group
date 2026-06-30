"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage(): React.ReactElement {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin.login");
  const errors = useTranslations("errors");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
        },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? errors("loginFailed"));
      }

      router.push("/admin/news");
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : errors("loginFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="section-container flex min-h-[calc(100vh-5rem)] items-center justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-text-primary">{t("title")}</h2>
        <p className="mt-2 text-sm text-text-secondary">{t("description")}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="password" className="form-label">
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? t("signingIn") : t("signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
