import * as React from "react";
import { SelectField, Button, Loader, Alert } from "@snailycad/ui";
import { useVisibility } from "../components/visibility-provider";
import { StatusValue } from "@snailycad/types";
import { useMutation } from "@tanstack/react-query";
import { PutDispatchStatusByUnitId } from "@snailycad/types/api";
import { handleClientCadRequest } from "../fetch.client";
import { createNotification } from "../flows/notification";

export function SetStatusScreen() {
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);

  const { hide, data: actionData } = useVisibility<{
    statusCodes?: StatusValue[];
    unitId?: string;
    source?: number;
  }>();

  const mutation = useMutation<PutDispatchStatusByUnitId, Error, { statusId: string }>({
    mutationKey: ["set-unit-status"],
    onSuccess(unit) {
      hide();

      createNotification({
        title: "Status updated",
        message: `Successfully updated your status to ${unit.status?.value.value}.`,
      });
    },
    mutationFn: async (variables) => {
      if (!actionData?.url || !actionData.userApiToken) {
        throw new Error("SnailyCAD API URL and/or Personal API Token not provided.");
      }

      const { data, error, errorMessage } = await handleClientCadRequest<PutDispatchStatusByUnitId>(
        {
          url: actionData.url,
          path: `/dispatch/status/${actionData.unitId}`,
          method: "PUT",
          data: { status: variables.statusId },
          headers: { userApiToken: actionData.userApiToken },
        },
      );

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
    if (!selectedKey) return;

    mutation.mutate({ statusId: selectedKey });
  }

  return (
    <div className="max-w-lg rounded-md bg-primary p-8">
      <header className="mb-2">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Set Status</h1>

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

        <p className="text-neutral-200">Set the status for your active unit.</p>
      </header>

      {mutation.error ? (
        <Alert type="error" title="An error occurred" message={mutation.error.message} />
      ) : null}

      <form onSubmit={onSubmit} className="mt-3">
        <SelectField
          selectedKey={selectedKey}
          onSelectionChange={(key) => setSelectedKey(key as string)}
          label="Status"
          options={(actionData?.statusCodes ?? []).map((v) => ({
            label: v.value.value,
            value: v.id,
          }))}
        />

        <p className="text-neutral-200 mt-2">
          Additionally use
          <code className="inline-block bg-secondary p-0.5">
            /sn-set-status &lt;status-code&gt;
          </code>
        </p>

        <Button className="flex gap-2 items-center" type="submit" isDisabled={mutation.isLoading}>
          {mutation.isLoading ? <Loader /> : null}
          Save
        </Button>
      </form>
    </div>
  );
}
