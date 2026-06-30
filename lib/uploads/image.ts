import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const ALLOWED_FOLDERS = new Set(["news", "products"]);

export const UPLOAD_ERROR_KEYS = new Set([
  "invalidUploadFolder",
  "invalidImageType",
  "imageTooLarge",
]);

export async function saveUploadedImage(
  file: File,
  folder: string,
): Promise<string> {
  if (!ALLOWED_FOLDERS.has(folder)) {
    throw new Error("invalidUploadFolder");
  }

  const extension = ALLOWED_TYPES.get(file.type);

  if (!extension) {
    throw new Error("invalidImageType");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("imageTooLarge");
  }

  const uploadDir = path.join(UPLOAD_ROOT, folder);
  await fs.mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}${extension}`;
  const filepath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  return `/uploads/${folder}/${filename}`;
}
