/**
 * unit status flow
 */

import { ClientEvents, NuiEvents, ServerEvents, SnCommands } from "~/types/events";

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
  (unitId: string, source: number, identifiers: string[], calls: any[]) => {
    SendNuiMessage(
      JSON.stringify({
        action: ClientEvents.RequestCall911AttachFlow,
        data: { url: API_URL, source, unitId, identifiers, calls },
      }),
    );
    SetNuiFocus(true, true);
  },
);

RegisterNuiCallbackType(NuiEvents.OnCall911Attach);
on(
  `__cfx_nui:${NuiEvents.OnCall911Attach}`,
  (data: { unitId: string; source: number; callId: string }, cb: Function) => {
    SetNuiFocus(false, false);
    cb({ ok: true });

    emitNet(ServerEvents.OnCall911Attach, data.source, data.unitId, data.callId);
  },
);

// the 911 modal has been closed
RegisterNuiCallbackType(NuiEvents.CloseSetStatusFlow);
on(`__cfx_nui:${NuiEvents.CloseSetStatusFlow}`, (_data: unknown, cb: Function) => {
  SetNuiFocus(false, false);
  cb({ ok: true });
});
