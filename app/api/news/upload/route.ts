import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/auth/admin";
import { apiError } from "@/lib/i18n/api";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "news");
const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAdminRequest(request))) {
    return apiError(request, "unauthorized", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return apiError(request, "noFileUploaded", 400);
    }

    const extension = ALLOWED_TYPES.get(file.type);

    if (!extension) {
      return apiError(request, "invalidImageType", 400);
    }

    if (file.size > 5 * 1024 * 1024) {
      return apiError(request, "imageTooLarge", 400);
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const filename = `${randomUUID()}${extension}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/news/${filename}` });
  } catch (error) {
    console.error("Failed to upload image:", error);
    return apiError(request, "uploadFailed", 500);
  }
}
