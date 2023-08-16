import { fetchNUI } from "../main";
import { NuiEvents } from "../types";

interface HandleSetStatusFlowOptions {
  statusCodes: any[];
}

export async function handleSetStatusFlow(options: HandleSetStatusFlowOptions) {
  const closeSetStatusButton = document.getElementById("close-set-status-flow");
  if (closeSetStatusButton) {
    closeSetStatusButton.addEventListener("click", async () => {
      const setStatusElement = document.getElementById("set-status-flow");
      await fetchNUI(NuiEvents.CloseSetStatusFlow, {});

      if (setStatusElement) {
        setStatusElement.classList.add("hidden");
      }
    });
  }

  const selectElement = document.getElementById("unit_status") as HTMLSelectElement | null;
  if (!selectElement) return;

  options.statusCodes.forEach((statusCode) => {
    selectElement.appendChild(createOptionElement(statusCode.value.value, statusCode.id));
  });
}

function createOptionElement(text: string, value: string) {
  const optionElement = document.createElement("option");
  optionElement.innerText = text;
  optionElement.value = value;

  return optionElement;
}
