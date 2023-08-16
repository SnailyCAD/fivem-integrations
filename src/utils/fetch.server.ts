import { request } from "undici";
import "./version.server";

interface CadRequestOptions<TData extends Record<string, unknown>> {
  path: string;
  method: "POST" | "GET";
  data?: TData;
  headers?: {
    userApiToken?: string;
  };
}

export async function cadRequest<T, TData extends Record<string, unknown> = Record<string, string>>(
  options: CadRequestOptions<TData>,
): Promise<{ data: T | null; error?: unknown; errorMessage?: string }> {
  const url = GetConvar("snailycad_url", "null");
  const apiKey = GetConvar("snailycad_api_key", "null");

  if (url === "null") {
    console.warn("No `snailycad_url` convar was found in your server.cfg");
    return { errorMessage: "No `snailycad_url` convar was found in your server.cfg", data: null };
  }

  let tokenHeader = { "snaily-cad-api-token": apiKey } as Record<string, string>;

  if (options.headers?.userApiToken && typeof options.headers.userApiToken === "string") {
    tokenHeader = { "snaily-cad-user-api-token": options.headers.userApiToken };
  }

  try {
    const response = await request(`${url}${options.path}`, {
      method: options.method,
      body: options.data ? JSON.stringify(options.data) : undefined,
      headers: {
        "is-from-dispatch": "true",
        "content-type": "application/json",
        ...tokenHeader,
      },
    });

    const json = await response.body.json();
    return { data: json as T | null };
  } catch (error) {
    console.error("SnailyCAD API error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { data: null, error, errorMessage };
  }
}
