"use client";

import React, { useCallback, useRef, useState } from "react";
import { FileText, ImageIcon, UploadCloud, X, RefreshCw } from "lucide-react";
import { useLang } from "@/lib/i18n/provider";
import { formatBytes } from "@/lib/utils";
import { ACCEPTED_EXT, MAX_UPLOAD_BYTES } from "@/lib/constants";

export interface FileUploadProps {
  label: string;
  required?: boolean;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function FileUpload({
  label,
  required,
  value,
  onChange,
  error,
}: FileUploadProps) {
  const { d } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const accept = value?.type.startsWith("image/") ? value.type : undefined;

  const handleFile = useCallback(
    (file: File | null) => {
      setLocalError(null);
      if (!file) {
        onChange(null);
        setPreview(null);
        return;
      }
      const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
      if (!ACCEPTED_EXT.includes(ext)) {
        setLocalError("Use PDF, JPG, JPEG or PNG");
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setLocalError(
          `Max ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB`,
        );
        return;
      }
      onChange(file);
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreview(url);
      } else {
        setPreview(null);
      }
    },
    [onChange],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0] || null;
      handleFile(file);
    },
    [handleFile],
  );

  const shownError = error || localError;

  return (
    <div>
      <label className="field-label">
        {label} {required && <span className="text-rose-500">*</span>}
        {!required && (
          <span className="ms-1 text-xs font-normal text-brand-muted">
            ({d.form.optional})
          </span>
        )}
      </label>

      {!value ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
          }
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${
            dragOver
              ? "border-leaf bg-leaf/10"
              : "border-emerald/20 bg-white/60 hover:border-leaf/60 hover:bg-white"
          }`}
        >
          <UploadCloud className="h-7 w-7 text-emerald/70" />
          <p className="text-sm font-medium text-emerald-deep">
            {d.form.dropHere}
          </p>
          <p className="text-xs text-brand-muted">
            {d.form.uploadHint} {Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-emerald/15 bg-white/80 p-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-emerald/5">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover"
              />
            ) : value.type === "application/pdf" ? (
              <FileText className="h-6 w-6 text-teal" />
            ) : (
              <ImageIcon className="h-6 w-6 text-teal" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-emerald-deep">
              {value.name}
            </p>
            <p className="text-xs text-brand-muted">{formatBytes(value.size)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="grid h-8 w-8 place-items-center rounded-lg text-teal hover:bg-teal/10"
              aria-label={d.form.replace}
              title={d.form.replace}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleFile(null)}
              className="grid h-8 w-8 place-items-center rounded-lg text-rose-500 hover:bg-rose-50"
              aria-label={d.form.remove}
              title={d.form.remove}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept || ".pdf,.jpg,.jpeg,.png,application/pdf,image/*"}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />

      {shownError && <p className="field-error">{shownError}</p>}
    </div>
  );
}
