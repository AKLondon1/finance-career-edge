import {
  CV_UPLOAD_BUCKET,
  formatMaxCvFileSize,
  getFileExtension,
  isAcceptedCvExtension,
  MAX_CV_FILE_SIZE_BYTES,
} from "@/lib/cv-file-rules";
import { extractCvTextFromFile } from "@/lib/cv-text-extraction";
import { getSupabaseServerConfig } from "@/lib/supabase/server";
import type { CvTextExtractionResult } from "@/lib/cv-text-extraction";

export type StoredCvFile = {
  cvFileName: string;
  cvFileSize: number;
  cvFileType: string;
  cvStorageBucket: string;
  cvStoragePath: string;
  extraction: CvTextExtractionResult;
  extractedText?: string;
};

type StoreCvFileOptions = {
  requireReadableText?: boolean;
};

const allowedMimeTypes: Record<string, string[]> = {
  ".docx": [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream",
  ],
  ".pdf": ["application/pdf", "application/octet-stream"],
  ".txt": ["text/plain", "application/octet-stream"],
};

export class CvUploadError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "CvUploadError";
  }
}

export function validateCvFile(file: File) {
  const extension = getFileExtension(file.name);

  if (!isAcceptedCvExtension(extension)) {
    return "Upload a PDF, DOCX or TXT version of your CV.";
  }

  if (file.size <= 0) {
    return "Upload a CV file with content.";
  }

  if (file.size > MAX_CV_FILE_SIZE_BYTES) {
    return `Upload a CV file under ${formatMaxCvFileSize()}.`;
  }

  const mimeType = file.type.toLowerCase();
  const allowedForExtension = allowedMimeTypes[extension];

  if (mimeType && !allowedForExtension.includes(mimeType)) {
    return "Upload a PDF, DOCX or TXT version of your CV.";
  }

  return null;
}

export async function storeCvFile(
  file: File,
  options: StoreCvFileOptions = {},
): Promise<StoredCvFile> {
  const validationError = validateCvFile(file);

  if (validationError) {
    throw new CvUploadError(validationError, 400, "invalid-file");
  }

  const config = getSupabaseServerConfig();

  if (!config) {
    throw new CvUploadError("CV upload is not configured.", 503, "storage-unavailable");
  }

  const extension = getFileExtension(file.name);

  if (!isAcceptedCvExtension(extension)) {
    throw new CvUploadError("Unsupported CV file type.", 400, "invalid-file");
  }

  const safeFileName = sanitiseFileName(file.name);
  const storagePath = [
    new Date().toISOString().slice(0, 10),
    `${crypto.randomUUID()}-${safeFileName}`,
  ].join("/");
  const arrayBuffer = await file.arrayBuffer();
  const contentType =
    file.type && file.type !== "application/octet-stream"
      ? file.type
      : contentTypeForExtension(extension);
  const extraction = await extractCvTextFromFile({
    arrayBuffer,
    extension,
    fileSize: file.size,
    fileType: contentType,
  });

  console.info("CV text extraction completed", {
    extractedCharacterCount: extraction.characterCount,
    extractionSuccess: extraction.success,
    failureStage: extraction.failureStage ?? null,
    fileSize: file.size,
    fileType: contentType,
  });

  if (options.requireReadableText && !extraction.text) {
    throw new CvUploadError(
      "CV text could not be extracted.",
      400,
      extraction.failureStage ?? "unreadable-cv-text",
    );
  }

  const response = await fetch(
    `${config.url}/storage/v1/object/${CV_UPLOAD_BUCKET}/${encodeStoragePath(storagePath)}`,
    {
      body: arrayBuffer,
      headers: {
        apikey: config.serviceRoleKey,
        authorization: `Bearer ${config.serviceRoleKey}`,
        "cache-control": "3600",
        "content-type": contentType,
        "x-upsert": "false",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new CvUploadError(
      "CV upload could not be saved.",
      response.status,
      response.statusText || "storage-upload-failed",
    );
  }

  return {
    cvFileName: file.name,
    cvFileSize: file.size,
    cvFileType: contentType,
    cvStorageBucket: CV_UPLOAD_BUCKET,
    cvStoragePath: storagePath,
    extraction,
    extractedText: extraction.text,
  };
}

function sanitiseFileName(fileName: string) {
  const cleaned = fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || "cv-upload";
}

function encodeStoragePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function contentTypeForExtension(extension: string) {
  if (extension === ".pdf") {
    return "application/pdf";
  }

  if (extension === ".docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return "text/plain";
}
