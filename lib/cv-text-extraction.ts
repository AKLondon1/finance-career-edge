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
  wordCount: number;
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

type PdfJsModule = typeof import("pdfjs-dist/legacy/build/pdf.mjs");
type PdfTextContentItem = {
  hasEOL?: boolean;
  str?: string;
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
      wordCount: 0,
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
      wordCount: 0,
    };
  }

  const metrics = getTextMetrics(normalised);

  if (!isUsefulCvText(metrics)) {
    return {
      characterCount: metrics.characterCount,
      failureStage: "short-or-unusable-text",
      success: false,
      wordCount: metrics.wordCount,
    };
  }

  const text = truncateCvText(normalised);
  const truncatedMetrics = getTextMetrics(text);

  return {
    characterCount: truncatedMetrics.characterCount,
    success: true,
    text,
    wordCount: truncatedMetrics.wordCount,
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
    return extractPdfText(Buffer.from(arrayBuffer));
  }

  return "";
}

async function extractPdfText(buffer: Buffer) {
  try {
    const text = await extractPdfTextWithPdfJs(buffer);
    const metrics = getTextMetrics(normaliseCvText(text));

    console.info("PDF text extraction parser completed", {
      extractedCharacterCount: metrics.characterCount,
      extractedWordCount: metrics.wordCount,
      parser: "pdfjs-dist",
    });

    if (isUsefulCvText(metrics)) {
      return text;
    }

    console.warn("PDF text extraction parser returned limited text; retrying", {
      extractedCharacterCount: metrics.characterCount,
      extractedWordCount: metrics.wordCount,
      parser: "pdfjs-dist",
    });
  } catch (error) {
    console.warn("PDF text extraction parser failed; retrying", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorSummary: summariseErrorMessage(error),
      parser: "pdfjs-dist",
    });
  }

  const text = await extractPdfTextWithPdfParse(buffer);
  const metrics = getTextMetrics(normaliseCvText(text));

  console.info("PDF text extraction parser completed", {
    extractedCharacterCount: metrics.characterCount,
    extractedWordCount: metrics.wordCount,
    parser: "pdf-parse",
  });

  return text;
}

async function extractPdfTextWithPdfJs(buffer: Buffer) {
  const pdfjs = await loadPdfJs();
  const bytes = Uint8Array.from(buffer);
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    disableFontFace: true,
    isEvalSupported: false,
    useSystemFonts: false,
    useWasm: false,
    useWorkerFetch: false,
    verbosity: pdfjs.VerbosityLevel.ERRORS,
  });
  const document = await loadingTask.promise;

  try {
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const textContent = await page.getTextContent({
        disableNormalization: false,
        includeMarkedContent: false,
      });
      const pageText: string[] = [];

      for (const item of textContent.items as PdfTextContentItem[]) {
        if (typeof item.str !== "string" || !item.str) {
          continue;
        }

        pageText.push(item.str);

        if (item.hasEOL) {
          pageText.push("\n");
        }
      }

      pages.push(pageText.join(" "));
      page.cleanup();
    }

    return pages.join("\n\n");
  } finally {
    await document.destroy();
  }
}

async function extractPdfTextWithPdfParse(buffer: Buffer) {
  const { PDFParse, VerbosityLevel } = await loadPdfParse();
  const parser = new PDFParse({
    data: buffer,
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

async function loadPdfJs(): Promise<PdfJsModule> {
  return import("pdfjs-dist/legacy/build/pdf.mjs");
}

async function loadPdfParse(): Promise<PdfParseApi> {
  return nodeRequire("pdf-parse") as PdfParseApi;
}

async function loadMammoth(): Promise<MammothApi> {
  const module = await import("mammoth");
  const maybeDefault = (module as { default?: MammothApi }).default;

  return maybeDefault ?? (module as unknown as MammothApi);
}

function getTextMetrics(text: string) {
  const letterCount = text.match(/\p{L}/gu)?.length ?? 0;
  const wordCount = text.match(/\p{L}[\p{L}'-]{1,}/gu)?.length ?? 0;

  return {
    characterCount: text.length,
    letterCount,
    wordCount,
  };
}

function isUsefulCvText(metrics: ReturnType<typeof getTextMetrics>) {
  return (
    metrics.characterCount >= MIN_EXTRACTED_CV_TEXT_CHARS &&
    metrics.wordCount >= 25 &&
    metrics.letterCount / metrics.characterCount >= 0.25
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
