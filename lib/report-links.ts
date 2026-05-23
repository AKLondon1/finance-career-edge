import { createHmac, timingSafeEqual } from "crypto";

const REPORT_LINK_PURPOSE = "finance-career-edge-report-link-v1";
const DEVELOPMENT_REPORT_LINK_SECRET =
  "finance-career-edge-local-report-link-secret";

export function createReportAccessToken(orderId: string) {
  const secret = getReportLinkSecret();

  if (!secret) {
    return null;
  }

  return createHmac("sha256", secret)
    .update(`${REPORT_LINK_PURPOSE}:${orderId}`)
    .digest("base64url");
}

export function verifyReportAccessToken(orderId: string, token: string | null | undefined) {
  if (!token) {
    return false;
  }

  const expectedToken = createReportAccessToken(orderId);

  if (!expectedToken) {
    return false;
  }

  return safeCompare(expectedToken, token);
}

export function buildSignedReportPath(orderId: string) {
  const token = createReportAccessToken(orderId);

  if (!token) {
    return null;
  }

  const params = new URLSearchParams({
    orderId,
    token,
  });

  return `/report?${params.toString()}`;
}

export function buildSignedReportUrl(orderId: string, appUrl: string) {
  const path = buildSignedReportPath(orderId);

  if (!path) {
    return null;
  }

  return new URL(path, appUrl).toString();
}

export function isReportLinkSecretConfigured() {
  return Boolean(process.env.REPORT_LINK_SECRET?.trim());
}

function getReportLinkSecret() {
  const configured = process.env.REPORT_LINK_SECRET?.trim();

  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV !== "production") {
    return DEVELOPMENT_REPORT_LINK_SECRET;
  }

  return null;
}

function safeCompare(expected: string, actual: string) {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
