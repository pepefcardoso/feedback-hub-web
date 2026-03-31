import { redirect } from "next/navigation";

export class AppError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AppError";
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
  skipRedirect?: boolean;
}

/**
 * Unified API Client for Server and Client Components.
 * Automatically handles cookie injection, 401 redirects, and standardizes errors.
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const isServer = typeof window === "undefined";
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  if (isServer) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const allCookies = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

      if (allCookies) {
        headers.set("Cookie", allCookies);
      }
    } catch (error) {
      console.warn("Failed to attach cookies on the server:", error);
    }
  }

  let url = `${baseUrl}${endpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams(options.params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData: { message?: string } = {};
    try {
      errorData = await response.json();
    } catch {
      // Ignored: Response is not JSON (e.g., 502 Bad Gateway HTML page)
    }

    if (response.status === 401) {
      if (options.skipRedirect) {
        throw new AppError("Unauthorized", 401);
      }
      if (isServer) {
        redirect("/login");
      } else {
        window.location.href = "/login";
        return new Promise(() => {});
      }
    }

    throw new AppError(
      errorData.message ||
        response.statusText ||
        "An unexpected error occurred",
      response.status,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
