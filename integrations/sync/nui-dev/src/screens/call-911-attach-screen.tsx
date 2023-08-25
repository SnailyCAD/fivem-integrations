import { Button } from "@snailycad/ui";
import { NuiEvents } from "../types";
import { fetchNUI } from "../main";
import { useVisibility } from "../components/visibility-provider";
import { AssignedUnit, Call911 } from "@snailycad/types";
import { cn } from "mxcn";
import { slateDataToString } from "@snailycad/utils/editor";

export function Call911AttachScreen() {
  const { hide, data } = useVisibility<{
    calls: (Call911 & { assignedUnits?: AssignedUnit[] })[];
    source: number;
    unitId: string;
  }>();

  function onClose() {
    hide();
    fetchNUI(NuiEvents.CloseCall911AttachFlow);
  }

  function handleAssignUnAssignClick(type: "assign" | "unassign", callId: string) {
    onClose();

    // todo: add loading state + error state in UI instead of chat.
    // instead of sending API requests via the server, we should
    // send the API requests here. If an error occurs, we should
    // show the error message in the UI.
    // use react-query for this.
    fetchNUI(NuiEvents.OnCall911Attach, {
      ...data,
      callId,
      type,
    });
  }

  return (
    <div className="w-[56em] rounded-md bg-primary p-8">
      <header className="mb-2">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Active 911 Calls</h1>

          <Button className="px-1 text-base" onPress={onClose}>
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
            {data?.calls.map((call) => {
              const isUnitAttached = call.assignedUnits?.some(
                (assignedUnit) => assignedUnit.unit?.id === data.unitId,
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
                      onPress={() =>
                        handleAssignUnAssignClick(isUnitAttached ? "unassign" : "assign", call.id)
                      }
                      size="xs"
                    >
                      {isUnitAttached ? "Unassign from call" : "Assign to call"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Button onPress={onClose}>Cancel</Button>
    </div>
  );
}
