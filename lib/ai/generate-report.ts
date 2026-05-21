import { generateReport as generateDeterministicReport } from "@/lib/report-generator";
import type {
  GeneratedReport,
  IntakeSubmission,
  PriorityFix,
  RewriteExample,
  ScoreAssessment,
} from "@/lib/types";

type AiProvider = "gemini" | "openai" | "deterministic";
type RemoteProvider = Exclude<AiProvider, "deterministic">;

type OpenAIReportBody = Pick<
  GeneratedReport,
  "score" | "executiveSummary" | "roleReport" | "cvDraft" | "interviewPrep" | "nextSteps"
>;

type OpenAIResponsesResult = {
  error?: {
    code?: string;
    message?: string;
  };
  output?: Array<{
    content?: Array<{
      refusal?: string;
      text?: string;
      type?: string;
    }>;
  }>;
  output_text?: string;
};

type GeminiGenerateContentResult = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_OPENAI_MODEL = "gpt-5.2";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

class AiProviderError extends Error {
  constructor(
    public readonly provider: RemoteProvider,
    public readonly stage: string,
    public readonly status?: number,
    public readonly code?: string,
    public readonly detail?: string,
  ) {
    super(`${provider} generation failed at ${stage}.`);
    this.name = "AiProviderError";
  }
}

export async function generateReportForSubmission(
  submission: IntakeSubmission,
): Promise<GeneratedReport> {
  const deterministicReport = generateDeterministicReport(submission);
  const config = getProviderConfig();

  console.info("AI report generation selected provider", {
    geminiKeyPresent: Boolean(config.geminiApiKey),
    openaiKeyPresent: Boolean(config.openaiApiKey),
    provider: config.selectedProvider,
  });

  for (const provider of config.attempts) {
    const model = provider === "gemini" ? config.geminiModel : config.openaiModel;
    const keyPresent = provider === "gemini" ? Boolean(config.geminiApiKey) : Boolean(config.openaiApiKey);

    console.info("AI report provider attempt", {
      keyPresent,
      model,
      provider,
    });

    if (!keyPresent) {
      logProviderFailure(new AiProviderError(provider, "missing-key", undefined, undefined, "Provider key is not configured."), model);
      continue;
    }

    try {
      if (provider === "gemini") {
        return await generateGeminiReport(
          submission,
          deterministicReport,
          config.geminiApiKey,
          config.geminiModel,
        );
      }

      return await generateOpenAIReport(
        submission,
        deterministicReport,
        config.openaiApiKey,
        config.openaiModel,
      );
    } catch (error) {
      logProviderFailure(toProviderError(error, provider), model);
    }
  }

  console.info("AI report generation using deterministic fallback");
  return deterministicReport;
}

function getProviderConfig() {
  const requestedProvider = normaliseProvider(process.env.AI_PROVIDER);
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
  const openaiApiKey = process.env.OPENAI_API_KEY?.trim() ?? "";
  const geminiModel = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const openaiModel = process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
  const selectedProvider =
    requestedProvider ?? (geminiApiKey ? "gemini" : openaiApiKey ? "openai" : "deterministic");

  return {
    attempts: buildProviderAttempts(selectedProvider),
    geminiApiKey,
    geminiModel,
    openaiApiKey,
    openaiModel,
    selectedProvider,
  };
}

function normaliseProvider(value: string | undefined): AiProvider | null {
  const provider = value?.trim().toLowerCase();

  if (provider === "gemini" || provider === "openai" || provider === "deterministic") {
    return provider;
  }

  return null;
}

function buildProviderAttempts(provider: AiProvider): RemoteProvider[] {
  if (provider === "gemini") {
    return ["gemini", "openai"];
  }

  if (provider === "openai") {
    return ["openai"];
  }

  return [];
}

async function generateGeminiReport(
  submission: IntakeSubmission,
  deterministicReport: GeneratedReport,
  apiKey: string,
  model: string,
): Promise<GeneratedReport> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const result = await requestGeminiReport({
      apiKey,
      model,
      signal: controller.signal,
      submission,
    });

    if (!result.ok) {
      throw new AiProviderError("gemini", "request", result.status, result.code, result.detail);
    }

    const outputText = extractGeminiOutputText(result.body);
    const body = parseAndValidateReportBody(outputText);
    console.info("AI report provider succeeded", {
      model,
      provider: "gemini",
      stage: "validated-output",
    });
    return buildGeneratedReport(body, deterministicReport);
  } finally {
    clearTimeout(timeout);
  }
}

type GeminiRequestInput = {
  apiKey: string;
  model: string;
  signal: AbortSignal;
  submission: IntakeSubmission;
};

async function requestGeminiReport({
  apiKey,
  model,
  signal,
  submission,
}: GeminiRequestInput) {
  const response = await fetch(
    `${GEMINI_API_BASE}/models/${encodeURIComponent(normaliseGeminiModel(model))}:generateContent`,
    {
      body: JSON.stringify(buildGeminiRequestBody(submission)),
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      method: "POST",
      signal,
    },
  );

  const body = (await response.json().catch(() => null)) as GeminiGenerateContentResult | null;

  return {
    body,
    code: providerErrorCode(body?.error?.status, body?.error?.code, response.statusText),
    detail: summariseProviderMessage(body?.error?.message),
    ok: response.ok,
    status: response.status,
  };
}

function buildGeminiRequestBody(submission: IntakeSubmission) {
  const base = {
    contents: [
      {
        parts: [{ text: buildUserPrompt(submission) }],
        role: "user",
      },
    ],
    generationConfig: {
      maxOutputTokens: 7000,
      responseMimeType: "application/json",
      temperature: 0.35,
      topP: 0.9,
    },
    systemInstruction: {
      parts: [{ text: buildSystemPrompt() }],
    },
  };

  return base;
}

function normaliseGeminiModel(model: string) {
  return model.replace(/^models\//, "");
}

async function generateOpenAIReport(
  submission: IntakeSubmission,
  deterministicReport: GeneratedReport,
  apiKey: string,
  model: string,
): Promise<GeneratedReport> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      body: JSON.stringify({
        input: [
          {
            content: buildSystemPrompt(),
            role: "system",
          },
          {
            content: buildUserPrompt(submission),
            role: "user",
          },
        ],
        max_output_tokens: 7000,
        model,
        text: {
          format: {
            description:
              "A Finance Career Edge senior-finance role report and application-specific CV draft.",
            name: "finance_career_edge_report",
            schema: reportBodySchema,
            strict: true,
            type: "json_schema",
          },
        },
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: controller.signal,
    });

    const body = (await response.json().catch(() => null)) as OpenAIResponsesResult | null;

    if (!response.ok) {
      throw new AiProviderError(
        "openai",
        "request",
        response.status,
        providerErrorCode(body?.error?.code, undefined, response.statusText),
        summariseProviderMessage(body?.error?.message),
      );
    }

    const outputText = extractOpenAIOutputText(body);
    const reportBody = parseAndValidateReportBody(outputText);
    console.info("AI report provider succeeded", {
      model,
      provider: "openai",
      stage: "validated-output",
    });
    return buildGeneratedReport(reportBody, deterministicReport);
  } finally {
    clearTimeout(timeout);
  }
}

function buildGeneratedReport(
  body: OpenAIReportBody,
  deterministicReport: GeneratedReport,
): GeneratedReport {
  return {
    ...body,
    candidateName: deterministicReport.candidateName,
    id: `fce-${Date.now()}`,
    packageChoice: deterministicReport.packageChoice,
    packageName: deterministicReport.packageName,
    targetCompany: deterministicReport.targetCompany,
    targetRole: deterministicReport.targetRole,
  };
}

function buildSystemPrompt() {
  return [
    "You are Finance Career Edge's senior finance application adviser.",
    "Write in British English with a clear, commercial, senior-finance tone.",
    "Assess the candidate against the target role and create both a tailored role report and an application-specific CV draft.",
    "Convert task-led finance experience into outcome-led positioning where the supplied evidence supports it.",
    "Use senior finance language around commercial impact, forecast accuracy, margin, cash, working capital, board-level reporting, stakeholder influence, pricing, transformation, controls, governance, decision support, performance management and business partnering.",
    "Be honest about gaps without being harsh.",
    "Do not invent employers, qualifications, numbers, systems, team sizes, revenue, margin, cash impact or achievements that the user has not provided.",
    "Where evidence is missing, phrase recommendations carefully as improvements to make, not as facts already achieved.",
    "Avoid hype, hiring promises and generic career-coach language.",
    "Return only valid JSON. Do not wrap it in Markdown.",
  ].join("\n");
}

function buildUserPrompt(submission: IntakeSubmission) {
  const suppliedContext = {
    candidateName: submission.fullName,
    cvFileName: submission.cvFileName || "",
    cvText: submission.cvText || "",
    currentPackage: submission.packageName,
    mainCvConcerns: submission.concerns || "",
    targetCompany: submission.targetCompany || "",
    targetJobAdvert: submission.jobAdvert || "",
    targetRole: submission.targetRole,
    topAchievements: submission.achievements || "",
  };

  return [
    "Prepare the Finance Career Edge report for this paid customer.",
    "The output must populate every section of the existing report dashboard:",
    "Overview, Role Fit, CV Draft, Keywords, Interview Prep and Next Steps.",
    "The CV Draft must include a rewritten professional profile, core skills, stronger achievement bullets and original-to-stronger wording examples.",
    "Return exactly one JSON object with this shape:",
    buildJsonShapeInstructions(),
    "If the customer supplied only a selected file name and no CV text, work from the target role, job advert and any optional context provided. Do not refer to internal file handling.",
    "Use only supplied evidence. For missing measures, recommend what to add rather than making up numbers.",
    "Write enough detail for a paid senior-finance customer to feel the output is practical and application-specific.",
    "",
    "Customer inputs:",
    JSON.stringify(suppliedContext, null, 2),
  ].join("\n");
}

const scoreAssessmentSchema = {
  additionalProperties: false,
  properties: {
    label: { type: "string" },
    score: { type: "integer" },
    text: { type: "string" },
  },
  required: ["label", "score", "text"],
  type: "object",
};

const priorityFixSchema = {
  additionalProperties: false,
  properties: {
    text: { type: "string" },
    title: { type: "string" },
  },
  required: ["title", "text"],
  type: "object",
};

const rewriteExampleSchema = {
  additionalProperties: false,
  properties: {
    after: { type: "string" },
    before: { type: "string" },
    why: { type: "string" },
  },
  required: ["before", "after", "why"],
  type: "object",
};

const reportBodySchema = {
  additionalProperties: false,
  properties: {
    cvDraft: {
      additionalProperties: false,
      properties: {
        achievementBullets: {
          items: { type: "string" },
          type: "array",
        },
        coreSkills: {
          items: { type: "string" },
          type: "array",
        },
        experienceExamples: {
          items: rewriteExampleSchema,
          type: "array",
        },
        profile: { type: "string" },
      },
      required: ["profile", "coreSkills", "achievementBullets", "experienceExamples"],
      type: "object",
    },
    executiveSummary: { type: "string" },
    interviewPrep: {
      items: { type: "string" },
      type: "array",
    },
    nextSteps: {
      items: { type: "string" },
      type: "array",
    },
    roleReport: {
      additionalProperties: false,
      properties: {
        assessments: {
          items: scoreAssessmentSchema,
          type: "array",
        },
        financeLanguageImprovements: {
          items: { type: "string" },
          type: "array",
        },
        keywordGaps: {
          items: { type: "string" },
          type: "array",
        },
        missingSignals: {
          items: { type: "string" },
          type: "array",
        },
        priorityFixes: {
          items: priorityFixSchema,
          type: "array",
        },
        strengths: {
          items: { type: "string" },
          type: "array",
        },
        weaknesses: {
          items: { type: "string" },
          type: "array",
        },
      },
      required: [
        "assessments",
        "keywordGaps",
        "priorityFixes",
        "strengths",
        "weaknesses",
        "missingSignals",
        "financeLanguageImprovements",
      ],
      type: "object",
    },
    score: { type: "integer" },
  },
  required: ["score", "executiveSummary", "roleReport", "cvDraft", "interviewPrep", "nextSteps"],
  type: "object",
};

function extractGeminiOutputText(result: GeminiGenerateContentResult | null) {
  if (result?.error) {
    throw new AiProviderError(
      "gemini",
      "provider-response",
      result.error.code,
      result.error.status,
      summariseProviderMessage(result.error.message),
    );
  }

  const text = result?.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .find((part) => typeof part.text === "string" && part.text.trim())?.text;

  if (text) {
    return text;
  }

  const finishReason = result?.candidates?.find((candidate) => candidate.finishReason)?.finishReason;
  throw new AiProviderError("gemini", "missing-output", undefined, finishReason);
}

function extractOpenAIOutputText(result: OpenAIResponsesResult | null) {
  if (result?.error) {
    throw new AiProviderError("openai", "provider-response", undefined, result.error.code);
  }

  if (typeof result?.output_text === "string" && result.output_text.trim()) {
    return result.output_text;
  }

  const content = result?.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === "output_text" && typeof item.text === "string");

  if (content?.text) {
    return content.text;
  }

  const refusal = result?.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === "refusal" && item.refusal);

  if (refusal) {
    throw new AiProviderError("openai", "refusal");
  }

  throw new AiProviderError("openai", "missing-output");
}

function parseAndValidateReportBody(outputText: string) {
  const parsed = parseJsonObject(outputText);
  return validateReportBody(parsed);
}

function parseJsonObject(outputText: string): unknown {
  const trimmed = outputText.trim();

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Provider output did not include JSON.");
    }

    return JSON.parse(trimmed.slice(start, end + 1)) as unknown;
  }
}

function validateReportBody(value: unknown): OpenAIReportBody {
  const body = asRecord(value);
  const roleReport = asRecord(body.roleReport);
  const cvDraft = asRecord(body.cvDraft);

  return {
    cvDraft: {
      achievementBullets: requireStringArray(cvDraft.achievementBullets, 3),
      coreSkills: requireStringArray(cvDraft.coreSkills, 6),
      experienceExamples: requireArray(cvDraft.experienceExamples, 2).map(validateRewriteExample),
      profile: requireString(cvDraft.profile),
    },
    executiveSummary: requireString(body.executiveSummary),
    interviewPrep: requireStringArray(body.interviewPrep, 5),
    nextSteps: requireStringArray(body.nextSteps, 5),
    roleReport: {
      assessments: requireArray(roleReport.assessments, 4).map(validateScoreAssessment),
      financeLanguageImprovements: requireStringArray(roleReport.financeLanguageImprovements, 3),
      keywordGaps: requireStringArray(roleReport.keywordGaps, 6),
      missingSignals: requireStringArray(roleReport.missingSignals, 5),
      priorityFixes: requireArray(roleReport.priorityFixes, 4).map(validatePriorityFix),
      strengths: requireStringArray(roleReport.strengths, 3),
      weaknesses: requireStringArray(roleReport.weaknesses, 3),
    },
    score: clampScore(requireNumber(body.score)),
  };
}

function validateScoreAssessment(value: unknown): ScoreAssessment {
  const item = asRecord(value);

  return {
    label: requireString(item.label),
    score: clampScore(requireNumber(item.score)),
    text: requireString(item.text),
  };
}

function validatePriorityFix(value: unknown): PriorityFix {
  const item = asRecord(value);

  return {
    text: requireString(item.text),
    title: requireString(item.title),
  };
}

function validateRewriteExample(value: unknown): RewriteExample {
  const item = asRecord(value);

  return {
    after: requireString(item.after),
    before: requireString(item.before),
    why: requireString(item.why),
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Expected object.");
  }

  return value as Record<string, unknown>;
}

function requireArray(value: unknown, minimumLength: number) {
  if (!Array.isArray(value) || value.length < minimumLength) {
    throw new Error("Expected array.");
  }

  return value;
}

function requireStringArray(value: unknown, minimumLength: number) {
  return requireArray(value, minimumLength).map(requireString);
}

function requireString(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Expected string.");
  }

  return value.trim();
}

function requireNumber(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Expected number.");
  }

  return value;
}

function clampScore(value: number) {
  return Math.max(45, Math.min(94, Math.round(value)));
}

function logProviderFailure(error: AiProviderError, model: string) {
  console.warn("AI report provider failed", {
    code: error.code,
    detail: error.detail,
    model,
    provider: error.provider,
    stage: error.stage,
    status: error.status,
  });
}

function toProviderError(error: unknown, provider: RemoteProvider) {
  if (error instanceof AiProviderError) {
    return error;
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new AiProviderError(provider, "timeout", undefined, undefined, "Provider request timed out.");
  }

  return new AiProviderError(provider, "validation-or-generation", undefined, undefined, "Provider output could not be validated.");
}

function providerErrorCode(
  first: string | number | undefined,
  second?: string | number,
  fallback?: string,
) {
  const value = first ?? second ?? fallback;
  return value === undefined ? undefined : String(value);
}

function summariseProviderMessage(message: string | undefined) {
  if (!message) {
    return undefined;
  }

  return message.replace(/\s+/g, " ").slice(0, 180);
}

function buildJsonShapeInstructions() {
  return JSON.stringify(
    {
      cvDraft: {
        achievementBullets: ["string", "string", "string"],
        coreSkills: ["string", "string", "string", "string", "string", "string"],
        experienceExamples: [
          {
            after: "string",
            before: "string",
            why: "string",
          },
          {
            after: "string",
            before: "string",
            why: "string",
          },
        ],
        profile: "string",
      },
      executiveSummary: "string",
      interviewPrep: ["string", "string", "string", "string", "string"],
      nextSteps: ["string", "string", "string", "string", "string"],
      roleReport: {
        assessments: [
          { label: "Commercial impact", score: 75, text: "string" },
          { label: "Seniority signal", score: 75, text: "string" },
          { label: "Role alignment", score: 75, text: "string" },
          { label: "Evidence and metrics", score: 75, text: "string" },
        ],
        financeLanguageImprovements: ["string", "string", "string"],
        keywordGaps: ["string", "string", "string", "string", "string", "string"],
        missingSignals: ["string", "string", "string", "string", "string"],
        priorityFixes: [
          { text: "string", title: "string" },
          { text: "string", title: "string" },
          { text: "string", title: "string" },
          { text: "string", title: "string" },
        ],
        strengths: ["string", "string", "string"],
        weaknesses: ["string", "string", "string"],
      },
      score: 75,
    },
    null,
    2,
  );
}
