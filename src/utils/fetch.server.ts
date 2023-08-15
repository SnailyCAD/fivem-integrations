import { request } from "undici";
import "./version.server";

export async function cadRequest<T extends Record<string, unknown>>(
  path: string,
  method: "POST" | "GET",
  data?: T,
) {
  const url = GetConvar("snailycad_url", "null");
  const apiKey = GetConvar("snailycad_api_key", "null");

  if (url === "null") {
    console.warn("No `snailycad_url` convar was found in your server.cfg");
    return undefined;
  }

  let tokenHeader = { "snaily-cad-api-token": apiKey } as Record<string, string>;

  if (data?.userApiToken && typeof data.userApiToken === "string") {
    tokenHeader = { "snaily-cad-user-api-token": data.userApiToken };
  }

  return request(`${url}${path}`, {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      "is-from-dispatch": "true",
      "content-type": "application/json",
      ...tokenHeader,
    },
  });
}
