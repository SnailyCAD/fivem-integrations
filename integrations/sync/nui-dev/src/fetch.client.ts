interface CadRequestOptions<TData = Record<string, unknown>> {
  url: string;
  path: string;
  method: "POST" | "GET" | "PUT";
  data?: TData;
}

export async function handleClientCadRequest<T>(options: CadRequestOptions<T>) {
  return fetch(`${options.url}${options.path}`, {
    method: options.method,
    body: options.data ? JSON.stringify(options.data) : undefined,
    headers: {
      "is-from-dispatch": "true",
      "content-type": "application/json",
    },
  });
}
