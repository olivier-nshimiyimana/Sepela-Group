"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import type { InterestOption } from "@/lib/validations/contact";
import type { SiteSettings } from "@/lib/settings/types";

interface ContactFormData {
  fullName: string;
  companyName: string;
  businessEmail: string;
  interest: InterestOption | "";
  projectBrief: string;
}

type ContactFormField = keyof ContactFormData;

type ContactFormErrors = Partial<Record<ContactFormField, string>>;

const INTEREST_VALUES: readonly InterestOption[] = [
  "sepela-cinema",
  "sepela-erp",
  "sepela-events",
  "sepela-e-voting",
  "custom-app-development",
  "business-automation",
  "cloud-scaling",
  "general-consultation",
] as const;

const INITIAL_FORM_DATA: ContactFormData = {
  fullName: "",
  companyName: "",
  businessEmail: "",
  interest: "",
  projectBrief: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactTranslator = ReturnType<typeof useTranslations<"contact">>;

function validateField(
  field: ContactFormField,
  value: string,
  t: ContactTranslator,
): string | undefined {
  switch (field) {
    case "fullName":
      if (!value.trim()) return t("validation.fullNameRequired");
      if (value.trim().length < 2) return t("validation.fullNameMin");
      return undefined;
    case "companyName":
      if (!value.trim()) return t("validation.companyNameRequired");
      if (value.trim().length < 2) return t("validation.companyNameMin");
      return undefined;
    case "businessEmail":
      if (!value.trim()) return t("validation.emailRequired");
      if (!EMAIL_PATTERN.test(value.trim())) return t("validation.emailInvalid");
      return undefined;
    case "interest":
      if (!value) return t("validation.interestRequired");
      return undefined;
    case "projectBrief":
      if (!value.trim()) return t("validation.briefRequired");
      if (value.trim().length < 20) return t("validation.briefMin");
      return undefined;
    default:
      return undefined;
  }
}

function validateForm(
  data: ContactFormData,
  t: ContactTranslator,
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  (Object.keys(data) as ContactFormField[]).forEach((field) => {
    const error = validateField(field, data[field], t);
    if (error) errors[field] = error;
  });

  return errors;
}

interface FormFieldProps {
  id: ContactFormField;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({
  id,
  label,
  error,
  children,
}: FormFieldProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="form-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface ContactProps {
  settings: SiteSettings;
}

export function Contact({ settings }: ContactProps): React.ReactElement {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactFormField, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const benefits = useMemo(
    () => t.raw("benefits") as string[],
    [t],
  );

  function handleChange(
    field: ContactFormField,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const error = validateField(field, value, t);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) {
          next[field] = error;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  }

  function handleBlur(field: ContactFormField): void {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field], t);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[field] = error;
      } else {
        delete next[field];
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validationErrors = validateForm(formData, t);
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      companyName: true,
      businessEmail: true,
      interest: true,
      projectBrief: true,
    });

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          companyName: formData.companyName.trim(),
          businessEmail: formData.businessEmail.trim(),
          interest: formData.interest,
          projectBrief: formData.projectBrief.trim(),
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        errors?: Record<string, string>;
        message?: string;
      };

      if (!response.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors as ContactFormErrors);
        }
        setSubmitError(data.errors?._form ?? t("errors.submitFailed"));
        return;
      }

      setIsSubmitted(true);
      setFormData(INITIAL_FORM_DATA);
      setTouched({});
      setErrors({});
    } catch {
      setSubmitError(t("errors.network"));
    } finally {
      setIsSubmitting(false);
    }
  }

  function fieldClassName(field: ContactFormField): string {
    return touched[field] && errors[field] ? "form-input form-input-error" : "form-input";
  }

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-brand-muted section-spacing section-spacing-end"
    >
      <div className="section-container">
        <header className="section-header">
          <h2 id="contact-heading" className="section-heading">
            {t("heading")}
          </h2>
        </header>

        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3
              className="text-[1.75rem] font-black leading-tight sm:text-3xl sm:font-bold"
              style={{ color: "var(--color-brand-primary)" }}
            >
              {t("title")}
            </h3>
            <p className="text-[1.0625rem] font-medium leading-relaxed text-text-secondary sm:text-base sm:font-normal">
              {t("description")}
            </p>

            <ul className="mt-2 flex flex-col gap-3.5 sm:gap-3" role="list">
              {benefits.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-base font-semibold text-text-primary sm:gap-2 sm:text-sm sm:font-normal"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <ul className="mt-6 flex flex-col gap-3.5 border-t border-gray-200 pt-6 sm:gap-3" role="list">
              <li className="flex items-center gap-3 text-base font-semibold text-text-primary sm:gap-2.5 sm:text-sm sm:font-normal">
                <Mail aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-primary sm:h-4 sm:w-4" />
                {settings.email}
              </li>
              <li className="flex items-center gap-3 text-base font-semibold text-text-primary sm:gap-2.5 sm:text-sm sm:font-normal">
                <Phone aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-primary sm:h-4 sm:w-4" />
                {settings.phone}
              </li>
              <li className="flex items-center gap-3 text-base font-semibold text-text-primary sm:gap-2.5 sm:text-sm sm:font-normal">
                <MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-primary sm:h-4 sm:w-4" />
                {settings.addressLine}, {settings.city}, {settings.country}
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            {isSubmitted ? (
              <div
                role="status"
                className="rounded-2xl border border-brand-primary/30 bg-brand-light p-8 text-center"
              >
                <p className="text-xl font-bold text-brand-primary sm:text-lg sm:font-semibold">
                  {t("successTitle")}
                </p>
                <p className="mt-2 text-base font-medium text-text-secondary sm:text-sm sm:font-normal">
                  {t("successDescription")}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="btn-outline mt-6"
                >
                  {t("submitAnother")}
                </button>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="fullName"
                    label={t("fullName")}
                    error={touched.fullName ? errors.fullName : undefined}
                  >
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e)}
                      onBlur={() => handleBlur("fullName")}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={
                        errors.fullName ? "fullName-error" : undefined
                      }
                      className={fieldClassName("fullName")}
                      placeholder={t("placeholders.fullName")}
                    />
                  </FormField>

                  <FormField
                    id="companyName"
                    label={t("companyName")}
                    error={touched.companyName ? errors.companyName : undefined}
                  >
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      autoComplete="organization"
                      value={formData.companyName}
                      onChange={(e) => handleChange("companyName", e)}
                      onBlur={() => handleBlur("companyName")}
                      aria-invalid={Boolean(errors.companyName)}
                      aria-describedby={
                        errors.companyName ? "companyName-error" : undefined
                      }
                      className={fieldClassName("companyName")}
                      placeholder={t("placeholders.companyName")}
                    />
                  </FormField>
                </div>

                <FormField
                  id="businessEmail"
                  label={t("businessEmail")}
                  error={touched.businessEmail ? errors.businessEmail : undefined}
                >
                  <input
                    id="businessEmail"
                    name="businessEmail"
                    type="email"
                    autoComplete="email"
                    value={formData.businessEmail}
                    onChange={(e) => handleChange("businessEmail", e)}
                    onBlur={() => handleBlur("businessEmail")}
                    aria-invalid={Boolean(errors.businessEmail)}
                    aria-describedby={
                      errors.businessEmail ? "businessEmail-error" : undefined
                    }
                    className={fieldClassName("businessEmail")}
                    placeholder={t("placeholders.businessEmail")}
                  />
                </FormField>

                <FormField
                  id="interest"
                  label={t("interest")}
                  error={touched.interest ? errors.interest : undefined}
                >
                  <select
                    id="interest"
                    name="interest"
                    value={formData.interest}
                    onChange={(e) => handleChange("interest", e)}
                    onBlur={() => handleBlur("interest")}
                    aria-invalid={Boolean(errors.interest)}
                    aria-describedby={
                      errors.interest ? "interest-error" : undefined
                    }
                    className={fieldClassName("interest")}
                  >
                    <option value="" disabled>
                      {t("selectOption")}
                    </option>
                    {INTEREST_VALUES.map((value) => (
                      <option key={value} value={value}>
                        {t(`interests.${value}`)}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  id="projectBrief"
                  label={t("projectBrief")}
                  error={touched.projectBrief ? errors.projectBrief : undefined}
                >
                  <textarea
                    id="projectBrief"
                    name="projectBrief"
                    rows={4}
                    value={formData.projectBrief}
                    onChange={(e) => handleChange("projectBrief", e)}
                    onBlur={() => handleBlur("projectBrief")}
                    aria-invalid={Boolean(errors.projectBrief)}
                    aria-describedby={
                      errors.projectBrief ? "projectBrief-error" : undefined
                    }
                    className={`${fieldClassName("projectBrief")} resize-y min-h-[120px]`}
                    placeholder={t("placeholders.projectBrief")}
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-start"
                >
                  {isSubmitting ? t("submitting") : t("submit")}
                </button>

                {submitError ? (
                  <p role="alert" className="form-error">
                    {submitError}
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
