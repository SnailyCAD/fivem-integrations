import { Alert, Button, Loader } from "@snailycad/ui";
import { useVisibility } from "../components/visibility-provider";
import { AssignedUnit, Call911 } from "@snailycad/types";
import { cn } from "mxcn";
import { slateDataToString } from "@snailycad/utils/editor";
import { useMutation } from "@tanstack/react-query";
import { handleClientCadRequest } from "../fetch.client";
import { Post911CallAssignUnAssign } from "@snailycad/types/api";
import { createNotification } from "../flows/notification";

export function Call911AttachScreen() {
  const { hide, data: actionData } = useVisibility<{
    calls: (Call911 & { assignedUnits?: AssignedUnit[] })[];
    source: number;
    unitId: string;
  }>();

  const mutation = useMutation<
    Post911CallAssignUnAssign,
    Error,
    { type: "assign" | "unassign"; callId: string }
  >({
    mutationKey: ["attach-to-911-call"],
    onSuccess(call, variables) {
      hide();

      if (variables.type === "assign") {
        createNotification({
          title: "Attached to call",
          message: `Successfully attached yourself to call #${call.caseNumber}.`,
        });
      } else {
        createNotification({
          title: "Unattached from call",
          message: `Successfully unattached yourself from call #${call.caseNumber}.`,
        });
      }
    },
    mutationFn: async (variables) => {
      if (!actionData?.url || !actionData.userApiToken) {
        throw new Error("SnailyCAD API URL and/or Personal API Token not provided.");
      }

      const { data, error, errorMessage } = await handleClientCadRequest<Post911CallAssignUnAssign>(
        {
          url: actionData.url,
          path: `/911-calls/${variables.type}/${variables.callId}`,
          method: "POST",
          data: { unit: actionData.unitId },
          headers: {
            userApiToken: actionData.userApiToken,
          },
        },
      );

      if (error || !data) {
        throw new Error(
          errorMessage || "Unknown error occurred. Please see F8 console for further details.",
        );
      }

      return data;
    },
  });

  return (
    <div className="w-[56em] rounded-md bg-primary p-8">
      <header className="mb-2">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Active 911 Calls</h1>

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

        <p className="text-neutral-200">
          A list of all active 911 calls. Click on any of them to assign yourself to a call.
          <br />
          Additionally use
          <code className="inline-block bg-secondary p-0.5">/sn-attach &lt;case-number&gt;</code>
        </p>
      </header>

      {mutation.error ? (
        <Alert type="error" title="An error occurred" message={mutation.error.message} />
      ) : null}

      <div className="thin-scrollbar mt-6 block max-w-full overflow-x-auto pb-5">
        <table className="w-full whitespace-nowrap text-white">
          <thead>
            <th className="select-none bg-gray-200 p-2 px-3 text-left text-sm font-semibold uppercase text-neutral-700 first:rounded-tl-md last:rounded-tr-md dark:bg-secondary dark:text-gray-400 lg:table-cell">
              Case Number
            </th>
            <th className="select-none bg-gray-200 p-2 px-3 text-left text-sm font-semibold uppercase text-neutral-700 first:rounded-tl-md last:rounded-tr-md dark:bg-secondary dark:text-gray-400 lg:table-cell">
              Location
            </th>
            <th className="select-none bg-gray-200 p-2 px-3 text-left text-sm font-semibold uppercase text-neutral-700 first:rounded-tl-md last:rounded-tr-md dark:bg-secondary dark:text-gray-400 lg:table-cell">
              Caller
            </th>
            <th className="select-none bg-gray-200 p-2 px-3 text-left text-sm font-semibold uppercase text-neutral-700 first:rounded-tl-md last:rounded-tr-md dark:bg-secondary dark:text-gray-400 lg:table-cell">
              Description
            </th>
            <th className="select-none bg-gray-200 p-2 px-3 text-left text-sm font-semibold uppercase text-neutral-700 first:rounded-tl-md last:rounded-tr-md dark:bg-secondary dark:text-gray-400 lg:table-cell">
              Actions
            </th>
          </thead>

          <tbody>
            {actionData?.calls.map((call) => {
              const isCurrentMutation = mutation.variables?.callId === call.id;
              const isUnitAttached = call.assignedUnits?.some(
                (assignedUnit) => assignedUnit.unit?.id === actionData.unitId,
              );

              const callDescription = call.descriptionData
                ? slateDataToString(call.descriptionData)
                : call.description;

              return (
                <tr className={cn(isUnitAttached && "bg-amber-900")} key={call.id}>
                  <td className="m-0 p-3 text-left">#{call.caseNumber}</td>
                  <td className="m-0 p-3 text-left">{call.location}</td>
                  <td className="m-0 p-3 text-left">{call.name}</td>
                  <td className="m-0 p-3 text-left">{callDescription || "None"}</td>
                  <td className="m-0 p-3 text-left">
                    <Button
                      className="flex items-center gap-2"
                      isDisabled={isCurrentMutation && mutation.isLoading}
                      onPress={() =>
                        mutation.mutate({
                          type: isUnitAttached ? "unassign" : "assign",
                          callId: call.id,
                        })
                      }
                      size="xs"
                    >
                      {isCurrentMutation && mutation.isLoading ? (
                        <Loader className="w-4 h-4" />
                      ) : null}
                      {isUnitAttached ? "Unassign from call" : "Assign to call"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Button onPress={hide}>Cancel</Button>
    </div>
  );
}
