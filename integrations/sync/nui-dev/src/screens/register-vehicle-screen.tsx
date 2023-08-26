import * as React from "react";
import { Button, Loader, Alert, TextField } from "@snailycad/ui";
import { useVisibility } from "../components/visibility-provider";
import { useMutation } from "@tanstack/react-query";
import { PostCitizenVehicleData } from "@snailycad/types/api";
import { handleClientCadRequest } from "../fetch.client";

export function RegisterVehicleScreen() {
  const { hide, data: actionData } = useVisibility<{
    plate: string;
    color: string;
    vehicleModelName: string;
  }>();

  const mutation = useMutation<PostCitizenVehicleData, Error, { statusId: string }>({
    mutationKey: ["register-vehicle"],
    onSuccess() {
      hide();

      // todo: notification
    },
    mutationFn: async () => {
      if (!actionData?.url || !actionData.userApiToken) {
        throw new Error("SnailyCAD API URL and/or Personal API Token not provided.");
      }

      const { data, error, errorMessage } = await handleClientCadRequest<PostCitizenVehicleData>({
        path: "/vehicles",
        method: "POST",
        url: actionData.url,
        // todo: data
        data: {},
        headers: { userApiToken: actionData.userApiToken },
      });

      if (error || !data) {
        throw new Error(
          error?.message ||
            errorMessage ||
            "Unknown error occurred. Please see F8 console for further details.",
        );
      }

      return data;
    },
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="max-w-lg rounded-md bg-primary p-8">
      <header className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Register Vehicle</h1>

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
      </header>

      {mutation.error ? (
        <Alert type="error" title="An error occurred" message={mutation.error.message} />
      ) : null}

      <form onSubmit={onSubmit} className="mt-3">
        <TextField label="Plate" defaultValue={actionData?.plate.toUpperCase()} />
        <TextField label="Color" defaultValue={actionData?.color} />

        <Button className="flex gap-2 items-center" type="submit" isDisabled={mutation.isLoading}>
          {mutation.isLoading ? <Loader /> : null}
          Register Vehicle
        </Button>
      </form>
    </div>
  );
}
