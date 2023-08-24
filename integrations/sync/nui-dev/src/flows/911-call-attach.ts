import { AssignedUnit, Call911 } from "@snailycad/types";
import { fetchNUI } from "../main";
import { NuiEvents } from "../types";
import { slateDataToString } from "../utils/slate-data-to-string";

interface HandleCall911AttachFlowOptions {
  calls: (Call911 & { assignedUnits?: AssignedUnit[] })[];
  source: number;
  unitId: string;
}

async function closeSetStatusFlow() {
  const setStatusElement = document.getElementById("call-911-attach-flow");
  await fetchNUI(NuiEvents.CloseCall911AttachFlow, {});

  if (setStatusElement) {
    setStatusElement.classList.add("hidden");
  }
}

export async function handleCall911AttachFlow(options: HandleCall911AttachFlowOptions) {
  const closeSetStatusButton = document.getElementById("close-call-911-attach-flow");
  const cancelSetStatusButton = document.getElementById("cancel-call-911-attach-flow");
  closeSetStatusButton?.addEventListener("click", async () => closeSetStatusFlow());
  cancelSetStatusButton?.addEventListener("click", async () => closeSetStatusFlow());

  const tableBody = document.getElementById("call-911-attach-flow-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  options.calls.forEach((call) => {
    const tableRow = createTableRow(call, options);
    tableBody.appendChild(tableRow);
  });
}

function createTableRow(
  call: Call911 & { assignedUnits?: AssignedUnit[] },
  options: Omit<HandleCall911AttachFlowOptions, "calls">,
) {
  const tableRow = document.createElement("tr");
  const isUnitAttached = call.assignedUnits?.some(
    (assignedUnit) => assignedUnit.unit?.id === options.unitId,
  );

  const assignToCallButton = document.createElement("button");
  assignToCallButton.className =
    "mt-2 cursor-pointer rounded-md border border-quinary bg-secondary p-0.5 px-2 text-white transition-colors hover:brightness-150 disabled:cursor-not-allowed disabled:opacity-60";

  assignToCallButton.innerText = isUnitAttached ? "Unassign from call" : "Assign to call";
  assignToCallButton.addEventListener("click", async () => {
    closeSetStatusFlow();
    fetchNUI(NuiEvents.OnCall911Attach, {
      ...options,
      callId: call.id,
      type: isUnitAttached ? "unassign" : "assign",
    });
  });

  const callDescription = call.descriptionData
    ? slateDataToString(call.descriptionData)
    : call.description;

  tableRow.innerHTML = `<tr>
    <td class="m-0 p-3 text-left">#${call.caseNumber}</td>
    <td class="m-0 p-3 text-left">${call.location}</td>
    <td class="m-0 p-3 text-left">${call.name}</td>
    <td class="m-0 p-3 text-left">${callDescription || "None"}</td>
  </tr>`;

  if (isUnitAttached) {
    tableRow.classList.add("bg-amber-900");
  }

  const lastCell = document.createElement("td");
  lastCell.className = "m-0 p-3 text-left";

  lastCell.appendChild(assignToCallButton);
  tableRow.appendChild(lastCell);

  return tableRow;
}
