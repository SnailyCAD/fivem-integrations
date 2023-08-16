import { fetchNUI } from "../main";
import { NuiEvents } from "../types";

interface HandleSetStatusFlowOptions {
  statusCodes: any[];
  source: number;
  unitId: string;
}

async function closeSetStatusFlow() {
  const setStatusElement = document.getElementById("set-status-flow");
  await fetchNUI(NuiEvents.CloseSetStatusFlow, {});

  if (setStatusElement) {
    setStatusElement.classList.add("hidden");
  }
}

export async function handleSetStatusFlow(options: HandleSetStatusFlowOptions) {
  const closeSetStatusButton = document.getElementById("close-set-status-flow");
  if (closeSetStatusButton) {
    closeSetStatusButton.addEventListener("click", async () => {
      closeSetStatusFlow();
    });
  }

  const selectElement = document.getElementById("unit_status_select") as HTMLSelectElement | null;
  if (!selectElement) return;

  options.statusCodes.forEach((statusCode) => {
    selectElement.appendChild(createOptionElement(statusCode.value.value, statusCode.id));
  });

  const setStatusFlowForm = document.getElementById("set-status-flow-form");
  if (!setStatusFlowForm) return;

  setStatusFlowForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const statusElement = document.getElementById("unit_status_select") as HTMLSelectElement | null;
    if (!statusElement) return;

    closeSetStatusFlow();
    fetchNUI(NuiEvents.OnSetUnitStatus, {
      ...options,
      statusCodeId: statusElement.value,
    });
  });
}

function createOptionElement(text: string, value: string) {
  const optionElement = document.createElement("option");
  optionElement.innerText = text;
  optionElement.value = value;

  return optionElement;
}
