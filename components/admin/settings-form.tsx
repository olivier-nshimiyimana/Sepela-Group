"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SOCIAL_PLATFORMS } from "@/lib/settings/social";
import type { SiteSettings } from "@/lib/settings/types";

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({
  initialSettings,
}: SettingsFormProps): React.ReactElement {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin.address");
  const errors = useTranslations("errors");
  const [form, setForm] = useState({
    email: initialSettings.email,
    phone: initialSettings.phone,
    addressLine: initialSettings.addressLine,
    city: initialSettings.city,
    country: initialSettings.country,
    footerTagline: initialSettings.footerTagline,
    facebookUrl: initialSettings.facebookUrl,
    instagramUrl: initialSettings.instagramUrl,
    xUrl: initialSettings.xUrl,
    tiktokUrl: initialSettings.tiktokUrl,
    youtubeUrl: initialSettings.youtubeUrl,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? errors("updateSettingsFailed"));
      }

      setSuccess(true);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : errors("updateSettingsFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form max-w-2xl">
      <div className="grid gap-5">
        <div>
          <label htmlFor="email" className="form-label">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="form-label">
            {t("phone")}
          </label>
          <input
            id="phone"
            className="form-input"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
            required
          />
        </div>
        <div>
          <label htmlFor="addressLine" className="form-label">
            {t("addressLine")}
          </label>
          <input
            id="addressLine"
            className="form-input"
            value={form.addressLine}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                addressLine: event.target.value,
              }))
            }
            required
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="form-label">
              {t("city")}
            </label>
            <input
              id="city"
              className="form-input"
              value={form.city}
              onChange={(event) =>
                setForm((current) => ({ ...current, city: event.target.value }))
              }
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="form-label">
              {t("country")}
            </label>
            <input
              id="country"
              className="form-input"
              value={form.country}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  country: event.target.value,
                }))
              }
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="footerTagline" className="form-label">
            {t("footerTagline")}
          </label>
          <textarea
            id="footerTagline"
            className="form-input min-h-24"
            value={form.footerTagline}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                footerTagline: event.target.value,
              }))
            }
            required
          />
        </div>

        <div className="border-t border-gray-200 pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
            {t("socialTitle")}
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            {t("socialDescription")}
          </p>
          <div className="mt-4 grid gap-4">
            {SOCIAL_PLATFORMS.map((platform) => (
              <div key={platform.key}>
                <label htmlFor={platform.key} className="form-label">
                  {platform.label}
                </label>
                <input
                  id={platform.key}
                  type="url"
                  className="form-input"
                  placeholder={`https://${platform.label.toLowerCase().replace(" ", "")}.com/sepelagroup`}
                  value={form[platform.key]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [platform.key]: event.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {error ? <p className="form-error mt-4">{error}</p> : null}
      {success ? (
        <p className="mt-4 text-sm font-medium text-green-700">{t("success")}</p>
      ) : null}

      <button type="submit" className="btn-primary mt-6" disabled={isSubmitting}>
        {isSubmitting ? t("saving") : t("save")}
      </button>
    </form>
  );
}
