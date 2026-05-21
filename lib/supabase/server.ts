type SupabaseConfig = {
  serviceRoleKey: string;
  url: string;
};

export class SupabaseRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly responseText?: string,
  ) {
    super(message);
    this.name = "SupabaseRequestError";
  }
}

export function getSupabaseServerConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { serviceRoleKey, url };
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseServerConfig());
}

export function getSupabaseConfigIssue() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return "missing-url";
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return "missing-service-key";
  }

  return null;
}

export async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  const config = getSupabaseServerConfig();

  if (!config) {
    throw new SupabaseRequestError("Supabase is not configured.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      authorization: `Bearer ${config.serviceRoleKey}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new SupabaseRequestError(
      "Supabase request failed.",
      response.status,
      await response.text(),
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
