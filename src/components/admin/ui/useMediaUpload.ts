"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useUploadMedia } from "@/lib/api/hooks/useMedia";
import type { UploadPurpose } from "@/lib/api/upload";

/** Wires a hidden file input + drag-and-drop to the presigned media upload flow. */
export function useMediaUpload(purpose: UploadPurpose, onUploaded?: (mediaId: string) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadMedia(purpose);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file || !onUploaded) return;
    setError(null);
    upload.mutate(file, {
      onSuccess: (media) => onUploaded(media.id),
      onError: (err) => setError(err instanceof Error ? err.message : "上傳失敗"),
    });
  };

  return {
    inputRef,
    isUploading: upload.isPending,
    error,
    openPicker: () => inputRef.current?.click(),
    inputProps: {
      ref: inputRef,
      type: "file" as const,
      hidden: true,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0]);
        e.target.value = "";
      },
    },
    dropProps: {
      onDragOver: (e: DragEvent) => e.preventDefault(),
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files?.[0]);
      },
    },
  };
}
