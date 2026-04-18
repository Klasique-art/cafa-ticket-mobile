import { isAxiosError } from "axios";

function readBackendMessage(data: unknown): string | null {
  if (!data) return null;

  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
      return "Backend returned an HTML error page (likely server/config issue).";
    }
    return trimmed.length > 240 ? `${trimmed.slice(0, 240)}...` : trimmed;
  }

  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = ["detail", "error", "message", "non_field_errors"];

    for (const key of candidates) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value;
      if (Array.isArray(value) && value.length > 0) return String(value[0]);
    }
  }

  return null;
}

export function formatAxiosError(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : "Unknown error";
  }

  const method = error.config?.method?.toUpperCase() || "GET";
  const url = error.config?.url || "(unknown url)";
  const status = error.response?.status || "NO_STATUS";
  const backendMessage = readBackendMessage(error.response?.data);

  if (backendMessage) {
    return `[${status}] ${method} ${url} - ${backendMessage}`;
  }

  return `[${status}] ${method} ${url} - ${error.message}`;
}

export function isAxios4xx(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  return typeof status === "number" && status >= 400 && status < 500;
}

export function isAxiosAuthError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === 401 || status === 403;
}

export function logAxiosError(label: string, error: unknown): void {
  if (isAxiosAuthError(error)) return;
  console.error(`${label}:`, formatAxiosError(error));
}

export function captureAxiosContext(error: unknown): Record<string, unknown> {
  if (!isAxiosError(error)) return {};

  return {
    status: error.response?.status,
    method: error.config?.method?.toUpperCase(),
    url: error.config?.url,
    backendMessage: readBackendMessage(error.response?.data),
  };
}
