import React from "react";
import { useVisibility } from "../components/visibility-provider";
import { Button, Loader, TextField } from "@snailycad/ui";
import { useMutation } from "@tanstack/react-query";
import { handleClientCadRequest } from "../fetch.client";

export function AuthenticationScreen() {
  const { hide, data } = useVisibility<{
    identifiers?: string[];
    url: string;
  }>();

  const mutation = useMutation<unknown, Error, { token: string; identifiers: any }>({
    mutationKey: ["authentication"],
    mutationFn: async (variables) => {
      if (!data?.url) return;

      const response = await handleClientCadRequest({
        url: data.url,
        path: "/user/api-token/validate",
        method: "POST",
        data: variables,
      });

      const json = await response.json();
      const hasErrors = json.name === "BAD_REQUEST" || json.status === 400;

      if (hasErrors) {
        if (json.message === "invalidToken") {
          throw new Error("An invalid Personal API Token was provided.");
        }

        throw new Error("Could not verify your Personal API Token.");
      }

      return json;
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const elements = event.currentTarget.elements;
    const tokenElement = elements.namedItem("api_token") as HTMLInputElement | null;
    if (!tokenElement || !data?.identifiers) return;

    await mutation.mutateAsync({
      identifiers: data.identifiers,
      token: tokenElement.value,
    });
  }

  return (
    <div className="w-[48em] rounded-md bg-primary p-8">
      <header className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-white">
            SnailyCAD Personal API Token Authentication
          </h1>

          <Button className="px-1 text-base" onPress={hide}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </Button>
        </div>

        <p>
          Use your Personal API Token found at your CAD URL {"->"} Account {"->"} API Token. <br />
          This will allow you to interact with the CAD from within FiveM.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-3">
        <TextField
          id="api_token"
          errorMessage={mutation.error?.message}
          label="Personal API Token"
          className="mb-2"
          type="password"
        />
        {mutation.data ? (
          <p className="text-green-400 mb-2 font-medium">
            You have successfully authenticated with SnailyCAD. You can now close this window.
          </p>
        ) : null}
        <Button className="flex gap-2 items-center" type="submit" isDisabled={mutation.isLoading}>
          {mutation.isLoading ? <Loader /> : null}
          Authenticate
        </Button>
      </form>
    </div>
  );
}
