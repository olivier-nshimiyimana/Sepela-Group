"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PRODUCT_ICON_OPTIONS } from "@/lib/products/icons";
import type { Product, ProductIconKey } from "@/lib/products/types";

interface ProductFormState {
  name: string;
  tagline: string;
  description: string;
  content: string;
  coverImage: string;
  images: string;
  features: string;
  icon: ProductIconKey;
  sortOrder: string;
  published: boolean;
}

interface ProductFormProps {
  mode: "create" | "edit";
  initialProduct?: Product;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  tagline: "",
  description: "",
  content: "",
  coverImage: "",
  images: "",
  features: "",
  icon: "clapperboard",
  sortOrder: "1",
  published: true,
};

export function ProductForm({
  mode,
  initialProduct,
}: ProductFormProps): React.ReactElement {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin.products");
  const actions = useTranslations("admin.actions");
  const errors = useTranslations("errors");
  const [form, setForm] = useState<ProductFormState>(() =>
    initialProduct
      ? {
          name: initialProduct.name,
          tagline: initialProduct.tagline,
          description: initialProduct.description,
          content: initialProduct.content,
          coverImage: initialProduct.coverImage,
          images: initialProduct.images.join("\n"),
          features: initialProduct.features.join("\n"),
          icon: initialProduct.icon,
          sortOrder: String(initialProduct.sortOrder),
          published: initialProduct.published,
        }
      : EMPTY_FORM,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function uploadImage(
    file: File,
    field: "coverImage" | "images",
  ): Promise<void> {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "products");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-locale": locale },
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? errors("uploadFailed"));
      }

      setForm((current) =>
        field === "coverImage"
          ? { ...current, coverImage: data.url ?? "" }
          : {
              ...current,
              images: current.images
                ? `${current.images}\n${data.url}`
                : (data.url ?? ""),
            },
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : errors("uploadFailed"),
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      content: form.content,
      coverImage: form.coverImage,
      images: form.images
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      features: form.features
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      icon: form.icon,
      sortOrder: Number(form.sortOrder) || 0,
      published: form.published,
    };

    const endpoint =
      mode === "create"
        ? "/api/products"
        : `/api/products/${initialProduct?.slug ?? ""}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ??
            (mode === "create"
              ? errors("createProductFailed")
              : errors("updateProductFailed")),
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : mode === "create"
            ? errors("createProductFailed")
            : errors("updateProductFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!initialProduct) {
      return;
    }

    const confirmed = window.confirm(
      t("deleteConfirm", { name: initialProduct.name }),
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${initialProduct.slug}`, {
        method: "DELETE",
        headers: { "x-locale": locale },
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? errors("deleteProductFailed"));
      }

      router.push("/admin/products");
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : errors("deleteProductFailed"),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const isBusy = isSubmitting || isUploading || isDeleting;

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="form-label">
              {t("formName")}
            </label>
            <input
              id="name"
              className="form-input"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
          </div>
          <div>
            <label htmlFor="icon" className="form-label">
              {t("formIcon")}
            </label>
            <select
              id="icon"
              className="form-input"
              value={form.icon}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  icon: event.target.value as ProductIconKey,
                }))
              }
            >
              {PRODUCT_ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tagline" className="form-label">
            {t("formTagline")}
          </label>
          <input
            id="tagline"
            className="form-input"
            value={form.tagline}
            onChange={(event) =>
              setForm((current) => ({ ...current, tagline: event.target.value }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="form-label">
            {t("formDescription")}
          </label>
          <textarea
            id="description"
            className="form-input min-h-24"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="form-label">
            {t("formContent")}
          </label>
          <textarea
            id="content"
            className="form-input min-h-56"
            value={form.content}
            onChange={(event) =>
              setForm((current) => ({ ...current, content: event.target.value }))
            }
            placeholder={t("contentPlaceholder")}
            required
          />
        </div>

        <div>
          <label htmlFor="features" className="form-label">
            {t("formFeatures")}
          </label>
          <textarea
            id="features"
            className="form-input min-h-28"
            value={form.features}
            onChange={(event) =>
              setForm((current) => ({ ...current, features: event.target.value }))
            }
            placeholder={t("featuresPlaceholder")}
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="sortOrder" className="form-label">
              {t("formSortOrder")}
            </label>
            <input
              id="sortOrder"
              type="number"
              min={0}
              className="form-input"
              value={form.sortOrder}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sortOrder: event.target.value,
                }))
              }
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    published: event.target.checked,
                  }))
                }
              />
              {t("formPublished")}
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="coverImage" className="form-label">
            {t("formCover")}
          </label>
          <input
            id="coverImage"
            className="form-input"
            value={form.coverImage}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                coverImage: event.target.value,
              }))
            }
            required
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="btn-outline cursor-pointer px-4 py-2 text-xs">
              {isUploading ? t("uploading") : t("uploadCover")}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadImage(file, "coverImage");
                  }
                }}
              />
            </label>
            {form.coverImage ? (
              <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={form.coverImage}
                  alt={t("coverPreview")}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="images" className="form-label">
            {t("formGallery")}
          </label>
          <textarea
            id="images"
            className="form-input min-h-24"
            value={form.images}
            onChange={(event) =>
              setForm((current) => ({ ...current, images: event.target.value }))
            }
            placeholder={t("galleryPlaceholder")}
          />
          <div className="mt-3">
            <label className="btn-outline cursor-pointer px-4 py-2 text-xs">
              {isUploading ? t("uploading") : t("uploadGallery")}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadImage(file, "images");
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {error ? <p className="form-error mt-4">{error}</p> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          className="btn-primary"
          disabled={isBusy}
        >
          {isSubmitting
            ? t("saving")
            : mode === "create"
              ? t("publishProduct")
              : t("updateProduct")}
        </button>
        <Link href="/admin/products" className="btn-outline">
          {actions("cancel")}
        </Link>
        {mode === "edit" && initialProduct ? (
          <button
            type="button"
            onClick={() => void handleDelete()}
            className="btn-outline border-red-300 text-red-700 hover:border-red-400 hover:bg-red-50 hover:text-red-800"
            disabled={isBusy}
          >
            {isDeleting ? t("deleting") : t("deleteProduct")}
          </button>
        ) : null}
      </div>
    </form>
  );
}
