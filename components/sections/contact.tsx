"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

type InterestOption =
  | "sepela-cinema"
  | "sepela-erp"
  | "sepela-events"
  | "custom-app-development"
  | "business-automation"
  | "cloud-scaling"
  | "general-consultation";

interface ContactFormData {
  fullName: string;
  companyName: string;
  businessEmail: string;
  interest: InterestOption | "";
  projectBrief: string;
}

type ContactFormField = keyof ContactFormData;

type ContactFormErrors = Partial<Record<ContactFormField, string>>;

interface InterestSelectOption {
  value: InterestOption;
  label: string;
}

const INTEREST_OPTIONS: readonly InterestSelectOption[] = [
  { value: "sepela-cinema", label: "Sepela Cinema" },
  { value: "sepela-erp", label: "Sepela ERP" },
  { value: "sepela-events", label: "Sepela Events" },
  { value: "custom-app-development", label: "Custom App Development" },
  { value: "business-automation", label: "Business & Process Automation" },
  { value: "cloud-scaling", label: "Cloud Computing & Scaling" },
  { value: "general-consultation", label: "General Consultation" },
] as const;

const INITIAL_FORM_DATA: ContactFormData = {
  fullName: "",
  companyName: "",
  businessEmail: "",
  interest: "",
  projectBrief: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(
  field: ContactFormField,
  value: string,
): string | undefined {
  switch (field) {
    case "fullName":
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 2) return "Enter at least 2 characters.";
      return undefined;
    case "companyName":
      if (!value.trim()) return "Company name is required.";
      if (value.trim().length < 2) return "Enter at least 2 characters.";
      return undefined;
    case "businessEmail":
      if (!value.trim()) return "Business email is required.";
      if (!EMAIL_PATTERN.test(value.trim()))
        return "Enter a valid email address.";
      return undefined;
    case "interest":
      if (!value) return "Select a product or service of interest.";
      return undefined;
    case "projectBrief":
      if (!value.trim()) return "Project brief is required.";
      if (value.trim().length < 20)
        return "Provide at least 20 characters describing your project.";
      return undefined;
    default:
      return undefined;
  }
}

function validateForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  (Object.keys(data) as ContactFormField[]).forEach((field) => {
    const error = validateField(field, data[field]);
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

export function Contact(): React.ReactElement {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactFormField, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    field: ContactFormField,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const error = validateField(field, value);
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
    const error = validateField(field, formData[field]);
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

    const validationErrors = validateForm(formData);
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
        headers: { "Content-Type": "application/json" },
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
        setSubmitError(
          data.errors?._form ?? "Submission failed. Please review your entries.",
        );
        return;
      }

      setIsSubmitted(true);
      setFormData(INITIAL_FORM_DATA);
      setTouched({});
      setErrors({});
    } catch {
      setSubmitError("Network error. Please try again.");
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
      className="bg-brand-muted py-20 sm:py-28"
    >
      <div className="section-container">
        <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <h2 id="contact-heading" className="section-heading">
            Ready to transform your operations?
          </h2>
        </header>

        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: "var(--color-brand-primary)" }}
            >
              Get in touch with us
            </h3>
            <p className="text-base leading-relaxed text-text-secondary">
              Fill out the form below, and we&apos;ll get back to you as soon as
              possible.
            </p>

            <ul className="mt-2 flex flex-col gap-3" role="list">
              {[
                "No commitment required",
                "Tailored product demonstrations",
                "Enterprise deployment guidance",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-text-primary"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            {isSubmitted ? (
              <div
                role="status"
                className="rounded-2xl border border-brand-primary/30 bg-brand-light p-8 text-center"
              >
                <p className="text-lg font-semibold text-brand-primary">
                  Request received
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  Our team will reach out shortly to confirm your consultation.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="btn-outline mt-6"
                >
                  Submit another request
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
                    label="Full Name"
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
                      placeholder="Jane Doe"
                    />
                  </FormField>

                  <FormField
                    id="companyName"
                    label="Company Name"
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
                      placeholder="Acme Corporation"
                    />
                  </FormField>
                </div>

                <FormField
                  id="businessEmail"
                  label="Business Email"
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
                    placeholder="jane@company.com"
                  />
                </FormField>

                <FormField
                  id="interest"
                  label="Product / Service of Interest"
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
                      Select an option
                    </option>
                    {INTEREST_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  id="projectBrief"
                  label="Project Brief"
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
                    placeholder="Describe your goals, timeline, and technical requirements..."
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-start"
                >
                  {isSubmitting ? "Submitting..." : "Request Consultation"}
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
