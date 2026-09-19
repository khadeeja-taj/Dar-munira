import { saveFile } from "./storage";

export interface ProcessedFile {
  label: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  data: Buffer;
}

/**
 * Extract any files in a FormData whose key starts with "file:" and read their
 * bytes. The label is the remainder of the key, e.g. "file:University ID Card".
 * Returns UploadedFile-shaped records ready for a Prisma nested create.
 */
export async function processFormFiles(
  form: FormData,
): Promise<ProcessedFile[]> {
  const results: ProcessedFile[] = [];
  const entries = Array.from(form.entries());
  for (const [key, value] of entries) {
    if (!key.startsWith("file:")) continue;
    if (typeof value === "string") continue;
    const file = value as File;
    if (!file || file.size === 0) continue;
    const saved = await saveFile(file);
    results.push({
      label: key.slice("file:".length).slice(0, 80),
      originalName: saved.originalName,
      storedName: saved.storedName,
      mimeType: saved.mimeType,
      size: saved.size,
      data: saved.data,
    });
  }
  return results;
}
