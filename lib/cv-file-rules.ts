export const CV_UPLOAD_BUCKET = "cv-uploads";
export const MAX_CV_FILE_SIZE_BYTES = 4 * 1024 * 1024;
export const CV_FILE_ACCEPT = ".pdf,.docx,.txt";
export const ACCEPTED_CV_EXTENSIONS = [".pdf", ".docx", ".txt"] as const;

export type AcceptedCvExtension = (typeof ACCEPTED_CV_EXTENSIONS)[number];

export function getFileExtension(fileName: string) {
  const trimmed = fileName.trim().toLowerCase();
  const dotIndex = trimmed.lastIndexOf(".");

  if (dotIndex === -1) {
    return "";
  }

  return trimmed.slice(dotIndex);
}

export function isAcceptedCvExtension(extension: string): extension is AcceptedCvExtension {
  return ACCEPTED_CV_EXTENSIONS.includes(extension as AcceptedCvExtension);
}

export function formatMaxCvFileSize() {
  return "4MB";
}
