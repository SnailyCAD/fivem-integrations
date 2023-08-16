/**
 * unit status flow
 */

import { ClientEvents, NuiEvents } from "~/types/Events";

const API_URL = GetConvar("snailycad_url", "null");

emit("chat:addSuggestion", "/sn-active-unit", "This will show your active unit's name and status.");
emit(
  "chat:addSuggestion",
  "/sn-set-status",
  "This will open a menu and will allow you to select a status for your active unit.",
  [{ name: "status-code", help: "The status code you want to set." }],
);

// request to open the set status modal
onNet(ClientEvents.RequestSetStatusFlow, (identifiers: string[], statusCodes: any[]) => {
  SendNuiMessage(
    JSON.stringify({
      action: ClientEvents.RequestSetStatusFlow,
      data: { url: API_URL, source, identifiers, statusCodes },
    }),
  );
  SetNuiFocus(true, true);
});

// the set status flow has been closed
RegisterNuiCallbackType(NuiEvents.CloseSetStatusFlow);
on(`__cfx_nui:${NuiEvents.CloseSetStatusFlow}`, (_data: unknown, cb: Function) => {
  SetNuiFocus(false, false);
  cb({ ok: true });
});
