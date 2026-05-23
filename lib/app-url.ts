export function getAppUrl(request?: Request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (configured) {
    return configured;
  }

  if (request) {
    return new URL(request.url).origin;
  }

  return "http://localhost:3000";
}
