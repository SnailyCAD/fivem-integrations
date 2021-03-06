import { request } from "undici";

export async function cadRequest<T = unknown>(path: string, method: "POST" | "GET", data: T) {
  const url = GetConvar("snailycad_url", "null");
  const apiKey = GetConvar("snailycad_api_key", "null");

  if (url === "null") {
    console.warn("No `snailycad_url` convar was found in your server.cfg");
    return;
  }

  return request(`${url}${path}`, {
    method,
    body: JSON.stringify(data),
    headers: {
      "is-from-dispatch": "true",
      "snaily-cad-api-token": apiKey,
      "content-type": "application/json",
    },
  });
}
