export async function handleClientCadRequest<T = unknown>(
  url: string,
  path: string,
  method: "POST" | "GET",
  data?: T,
) {
  return fetch(`${url}${path}`, {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      "is-from-dispatch": "true",
      "content-type": "application/json",
    },
  });
}
