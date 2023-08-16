interface HandleSetStatusFlowOptions {
  statusCodes: any[];
}

export async function handleSetStatusFlow(options: HandleSetStatusFlowOptions) {
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
