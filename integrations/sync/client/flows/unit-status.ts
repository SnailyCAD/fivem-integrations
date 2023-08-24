/**
 * unit status flow
 */

import { StatusValue } from "@snailycad/types";
import { ClientEvents, NuiEvents, ServerEvents, SnCommands } from "~/types/events";

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
  [{ name: "status-code", help: "The status code you want to set." }],
);

// request to open the set status modal
onNet(
  ClientEvents.RequestSetStatusFlow,
  (unitId: string, source: number, identifiers: string[], statusCodes: StatusValue[]) => {
    SendNuiMessage(
      JSON.stringify({
        action: ClientEvents.RequestSetStatusFlow,
        data: { url: API_URL, source, unitId, identifiers, statusCodes },
      }),
    );
    SetNuiFocus(true, true);
  },
);

RegisterNuiCallbackType(NuiEvents.OnSetUnitStatus);
on(
  `__cfx_nui:${NuiEvents.OnSetUnitStatus}`,
  (data: { unitId: string; source: number; statusCodeId: string }, cb: Function) => {
    SetNuiFocus(false, false);
    cb({ ok: true });

    emitNet(ServerEvents.OnSetUnitStatus, data.source, data.unitId, data.statusCodeId);
  },
);

// the set status flow has been closed
RegisterNuiCallbackType(NuiEvents.CloseSetStatusFlow);
on(`__cfx_nui:${NuiEvents.CloseSetStatusFlow}`, (_data: unknown, cb: Function) => {
  SetNuiFocus(false, false);
  cb({ ok: true });
});
