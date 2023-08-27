import { AssignedUnit, Call911 } from "@snailycad/types";
import { ClientEvents, SnCommands } from "~/types/events";

const API_URL = GetConvar("snailycad_url", "null");

emit(
  "chat:addSuggestion",
  `/${SnCommands.AttachTo911Call}`,
  "Attach your active unit to a 911 call.",
  [{ name: "case-number", help: "The case number of the 911 call (Optional)." }],
);

// request to open the 911 calls modal
onNet(
  ClientEvents.RequestCall911AttachFlow,
  (
    unitId: string,
    source: number,
    calls: (Call911 & { assignedUnits?: AssignedUnit[] })[],
    userApiToken: string,
  ) => {
    SendNuiMessage(
      JSON.stringify({
        action: ClientEvents.RequestCall911AttachFlow,
        data: { url: API_URL, userApiToken, source, unitId, calls },
      }),
    );
    SetNuiFocus(true, true);
  },
);
