interface CadRequestOptions<TData = Record<string, unknown>> {
  url: string;
  path: string;
  method: "POST" | "GET" | "PUT";
  data?: TData;
  isFromDispatch?: boolean;
  headers?: {
    userApiToken?: string;
  };
}

export async function handleClientCadRequest<
  T,
  TData extends Record<string, unknown> = Record<string, unknown>,
>(
  options: CadRequestOptions<TData>,
): Promise<{
  data: T | null;
  error?: Error;
  errorMessage?: string;
}> {
  try {
    const tokenHeader = options.headers?.userApiToken
      ? { "snaily-cad-user-api-token": options.headers.userApiToken }
      : undefined;

    const response = await fetch(`${options.url}${options.path}`, {
      method: options.method,
      body: options.data ? JSON.stringify(options.data) : undefined,
      headers: {
        "is-from-dispatch": "true",
        "content-type": "application/json",
        ...tokenHeader,
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const json = (await response.json()) as any;
    const isErrorStatus = json.status > 400 && json.status < 600;

    if (isErrorStatus) {
      console.log(JSON.stringify(json, null, 2));
      return { errorMessage: json.message, error: new Error(json), data: null };
    }

    return { data: json as T };
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");

    console.error("SnailyCAD API error:", error.message, JSON.stringify(err, null, 2));

    return { data: null, error, errorMessage: error.message };
  }
}
