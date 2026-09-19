import path from "path";
import crypto from "crypto";
import { ACCEPTED_MIME, ACCEPTED_EXT, MAX_UPLOAD_BYTES } from "./constants";

/**
 * File handling.
 *
 * Uploaded files are stored as bytes inside the database (UploadedFile.data).
 * This keeps the app fully portable — it deploys to any host (Vercel, Render,
 * Fly, …) with only a database and no separate object-storage service.
 */

export interface SavedFile {
  storedName: string;
  originalName: string;
  mimeType: string;
  size: number;
  data: Buffer;
}

export function validateFile(file: File): string | null {
  if (file.size > MAX_UPLOAD_BYTES) {
    return `File is too large (max ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB)`;
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!ACCEPTED_MIME.includes(file.type) && !ACCEPTED_EXT.includes(ext)) {
    return "Unsupported file type. Use PDF, JPG, JPEG or PNG";
  }
  return null;
}

export async function saveFile(file: File): Promise<SavedFile> {
  const err = validateFile(file);
  if (err) throw new Error(err);

  const ext = path.extname(file.name).toLowerCase() || ".bin";
  const storedName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
  const data = Buffer.from(await file.arrayBuffer());

  return {
    storedName,
    originalName: path.basename(file.name).slice(0, 200),
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    data,
  };
}
