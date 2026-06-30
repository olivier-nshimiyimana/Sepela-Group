import { NextResponse } from "next/server";

import { isAdminRequest } from "@/lib/auth/admin";
import { apiError } from "@/lib/i18n/api";
import { UPLOAD_ERROR_KEYS, saveUploadedImage } from "@/lib/uploads/image";

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAdminRequest(request))) {
    return apiError(request, "unauthorized", 401);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return apiError(request, "noFileUploaded", 400);
    }

    if (typeof folder !== "string" || !folder) {
      return apiError(request, "uploadFolderRequired", 400);
    }

    const url = await saveUploadedImage(file, folder);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to upload image:", error);

    if (error instanceof Error && UPLOAD_ERROR_KEYS.has(error.message)) {
      return apiError(request, error.message, 400);
    }

    return apiError(request, "uploadFailed", 500);
  }
}
