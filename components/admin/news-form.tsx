"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { NewsArticle } from "@/lib/news/types";

interface NewsFormState {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  images: string;
  published: boolean;
}

interface NewsFormProps {
  mode: "create" | "edit";
  initialArticle?: NewsArticle;
}

const EMPTY_FORM: NewsFormState = {
  title: "",
  excerpt: "",
  content: "",
  author: "Sepela Communications",
  coverImage: "",
  images: "",
  published: true,
};

export function NewsForm({
  mode,
  initialArticle,
}: NewsFormProps): React.ReactElement {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin.news");
  const actions = useTranslations("admin.actions");
  const errors = useTranslations("errors");
  const [form, setForm] = useState<NewsFormState>(() =>
    initialArticle
      ? {
          title: initialArticle.title,
          excerpt: initialArticle.excerpt,
          content: initialArticle.content,
          author: initialArticle.author,
          coverImage: initialArticle.coverImage,
          images: initialArticle.images.join("\n"),
          published: initialArticle.published,
        }
      : EMPTY_FORM,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadImage(file: File, field: "coverImage" | "images"): Promise<void> {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/news/upload", {
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
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      author: form.author,
      coverImage: form.coverImage,
      images: form.images
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      published: form.published,
    };

    const endpoint =
      mode === "create"
        ? "/api/news"
        : `/api/news/${initialArticle?.slug ?? ""}`;
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
        article?: NewsArticle;
      };

      if (!response.ok) {
        throw new Error(
          data.error ??
            (mode === "create"
              ? errors("createArticleFailed")
              : errors("updateArticleFailed")),
        );
      }

      router.push("/admin/news");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : mode === "create"
            ? errors("createArticleFailed")
            : errors("updateArticleFailed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="grid gap-6">
        <div>
          <label htmlFor="title" className="form-label">
            {t("formTitle")}
          </label>
          <input
            id="title"
            className="form-input"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            required
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="form-label">
            {t("formExcerpt")}
          </label>
          <textarea
            id="excerpt"
            className="form-input min-h-24"
            value={form.excerpt}
            onChange={(event) =>
              setForm((current) => ({ ...current, excerpt: event.target.value }))
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

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="author" className="form-label">
              {t("formAuthor")}
            </label>
            <input
              id="author"
              className="form-input"
              value={form.author}
              onChange={(event) =>
                setForm((current) => ({ ...current, author: event.target.value }))
              }
              required
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
            placeholder="/uploads/news/your-image.jpg"
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
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting
            ? t("saving")
            : mode === "create"
              ? t("publishArticle")
              : t("updateArticle")}
        </button>
        <Link href="/admin/news" className="btn-outline">
          {actions("cancel")}
        </Link>
      </div>
    </form>
  );
}
