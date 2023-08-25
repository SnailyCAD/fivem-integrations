/**
 * unit status flow
 */

import { StatusValue } from "@snailycad/types";
import { ClientEvents, SnCommands } from "~/types/events";

const API_URL = GetConvar("snailycad_url", "null");

emit(
  "chat:addSuggestion",
  `/${SnCommands.ActiveUnit}`,
  "This will show your active unit's name and status.",
);
emit(
  "chat:addSuggestion",
  `/${SnCommands.SetStatus}`,
  "This will open a menu and will allow you to select a status for your active unit.",
  [{ name: "status-code", help: "The status code you want to set (Optional)." }],
);

// request to open the set status modal
onNet(
  ClientEvents.RequestSetStatusFlow,
  (unitId: string, source: number, userApiToken: string, statusCodes: StatusValue[]) => {
    SendNuiMessage(
      JSON.stringify({
        action: ClientEvents.RequestSetStatusFlow,
        data: { url: API_URL, source, unitId, userApiToken, statusCodes },
      }),
    );
    SetNuiFocus(true, true);
  },
);
