"use client";

// Admin API client — all requests go through the Next.js /api proxy
// (rewritten to the NestJS backend), so the same origin serves everything.

const TOKEN_KEY = "aksharum_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  // Mirror in a cookie so the middleware can gate /admin routes
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${7 * 24 * 3600}; samesite=lax`;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`/api${path}`, { ...options, headers });

  if (res.status === 401 && typeof window !== "undefined") {
    clearToken();
    window.location.href = "/admin/login";
    throw new ApiError("Session expired", 401);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = Array.isArray(body.message)
        ? body.message.join(", ")
        : (body.message ?? message);
    } catch {
      /* keep default */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Authenticated multipart upload (branding images etc.). */
export async function apiUpload<T = unknown>(
  path: string,
  file: File,
  field = "file",
): Promise<T> {
  const fd = new FormData();
  fd.append(field, file);
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken() ?? ""}` },
    body: fd,
  });
  if (!res.ok) {
    let message = `Upload failed (${res.status})`;
    try {
      const body = await res.json();
      message = Array.isArray(body.message)
        ? body.message.join(", ")
        : (body.message ?? message);
    } catch {
      /* keep default */
    }
    throw new ApiError(message, res.status);
  }
  return (await res.json()) as T;
}

/** Authenticated file download (used for application resumes). */
export async function apiDownload(path: string, filename: string) {
  const res = await fetch(`/api${path}`, {
    headers: { Authorization: `Bearer ${getToken() ?? ""}` },
  });
  if (!res.ok) throw new ApiError(`Download failed (${res.status})`, res.status);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
