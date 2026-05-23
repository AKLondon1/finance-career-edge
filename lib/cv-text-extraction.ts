import { createRequire } from "node:module";

import type { AcceptedCvExtension } from "@/lib/cv-file-rules";

export type CvExtractionFailureStage =
  | "empty-text"
  | "parse-docx"
  | "parse-pdf"
  | "parse-txt"
  | "short-or-unusable-text"
  | "unsupported-extension";

export type CvTextExtractionResult = {
  characterCount: number;
  failureStage?: CvExtractionFailureStage;
  success: boolean;
  text?: string;
};

type CvTextExtractionInput = {
  arrayBuffer: ArrayBuffer;
  extension: AcceptedCvExtension;
  fileSize: number;
  fileType: string;
};

type MammothApi = {
  extractRawText(input: { buffer: Buffer }): Promise<{ value: string }>;
};

type PdfParseApi = {
  PDFParse: new (input: { data: Buffer; verbosity?: unknown }) => {
    destroy(): Promise<void>;
    getText(options?: { lineEnforce?: boolean; pageJoiner?: string }): Promise<{ text: string }>;
  };
  VerbosityLevel: {
    ERRORS: unknown;
  };
};

const nodeRequire = createRequire(import.meta.url);

export const MIN_EXTRACTED_CV_TEXT_CHARS = 120;
export const MAX_STORED_CV_TEXT_CHARS = 50000;

export async function extractCvTextFromFile({
  arrayBuffer,
  extension,
  fileSize,
  fileType,
}: CvTextExtractionInput): Promise<CvTextExtractionResult> {
  try {
    const rawText = await extractRawText(extension, arrayBuffer);
    return validateExtractedCvText(rawText);
  } catch (error) {
    const failureStage = failureStageForExtension(extension);

    console.warn("CV text extraction failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorSummary: summariseErrorMessage(error),
      extractionStage: failureStage,
      fileSize,
      fileType,
    });

    return {
      characterCount: 0,
      failureStage,
      success: false,
    };
  }
}

export function normaliseCvText(value: string | undefined) {
  return (value ?? "")
    .replace(/\u0000/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function validateExtractedCvText(value: string | undefined): CvTextExtractionResult {
  const normalised = normaliseCvText(value);

  if (!normalised) {
    return {
      characterCount: 0,
      failureStage: "empty-text",
      success: false,
    };
  }

  if (!isUsefulCvText(normalised)) {
    return {
      characterCount: normalised.length,
      failureStage: "short-or-unusable-text",
      success: false,
    };
  }

  const text = truncateCvText(normalised);

  return {
    characterCount: text.length,
    success: true,
    text,
  };
}

export function chooseBestCvEvidence(
  pastedCvText: string | undefined,
  extractedCvText: string | undefined,
) {
  const pasted = normaliseCvText(pastedCvText);
  const extracted = normaliseCvText(extractedCvText);

  if (!pasted) {
    return extracted || undefined;
  }

  if (!extracted) {
    return pasted;
  }

  return extracted.length > pasted.length ? extracted : pasted;
}

async function extractRawText(
  extension: AcceptedCvExtension,
  arrayBuffer: ArrayBuffer,
) {
  if (extension === ".txt") {
    return new TextDecoder("utf-8", { fatal: false }).decode(arrayBuffer);
  }

  if (extension === ".docx") {
    const mammoth = await loadMammoth();
    const result = await mammoth.extractRawText({
      buffer: Buffer.from(arrayBuffer),
    });
    return result.value;
  }

  if (extension === ".pdf") {
    const { PDFParse, VerbosityLevel } = await loadPdfParse();
    const parser = new PDFParse({
      data: Buffer.from(arrayBuffer),
      verbosity: VerbosityLevel.ERRORS,
    });

    try {
      const result = await parser.getText({
        lineEnforce: true,
        pageJoiner: "\n\n",
      });
      return result.text;
    } finally {
      await parser.destroy();
    }
  }

  return "";
}

async function loadPdfParse(): Promise<PdfParseApi> {
  return nodeRequire("pdf-parse") as PdfParseApi;
}

async function loadMammoth(): Promise<MammothApi> {
  const module = await import("mammoth");
  const maybeDefault = (module as { default?: MammothApi }).default;

  return maybeDefault ?? (module as unknown as MammothApi);
}

function isUsefulCvText(text: string) {
  const letterCount = text.match(/\p{L}/gu)?.length ?? 0;
  const wordCount = text.match(/\p{L}[\p{L}'-]{1,}/gu)?.length ?? 0;

  return (
    text.length >= MIN_EXTRACTED_CV_TEXT_CHARS &&
    wordCount >= 25 &&
    letterCount / text.length >= 0.25
  );
}

function truncateCvText(text: string) {
  if (text.length <= MAX_STORED_CV_TEXT_CHARS) {
    return text;
  }

  return text.slice(0, MAX_STORED_CV_TEXT_CHARS).trim();
}

function failureStageForExtension(extension: AcceptedCvExtension): CvExtractionFailureStage {
  if (extension === ".docx") {
    return "parse-docx";
  }

  if (extension === ".pdf") {
    return "parse-pdf";
  }

  if (extension === ".txt") {
    return "parse-txt";
  }

  return "unsupported-extension";
}

function summariseErrorMessage(error: unknown) {
  if (!(error instanceof Error) || !error.message) {
    return undefined;
  }

  return error.message.replace(/\s+/g, " ").slice(0, 160);
}
