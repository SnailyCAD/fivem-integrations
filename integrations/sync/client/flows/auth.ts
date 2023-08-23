import { ClientEvents, NuiEvents, ServerEvents, SnCommands } from "~/types/events";

/**
 * authentication flow
 */

const API_URL = GetConvar("snailycad_url", "null");

// add client command suggestion
emit(
  "chat:addSuggestion",
  `/${SnCommands.WhoAmI}`,
  "Shows your current SnailyCAD account username and ID that is connected to the game.",
);

emit(
  "chat:addSuggestion",
  `/${SnCommands.Auth}`,
  "Authenticate with your personal SnailyCAD API Token to interact with parts of it.",
);

// request to show the authentication flow modal
onNet(ClientEvents.RequestAuthFlow, (identifiers: string[], source: number) => {
  SendNuiMessage(
    JSON.stringify({
      action: ClientEvents.RequestAuthFlow,
      data: { url: API_URL, source, identifiers },
    }),
  );
  SetNuiFocus(true, true);
});

RegisterNuiCallbackType(NuiEvents.OnVerifyUserAPITokenRequest);
on(`__cfx_nui:${NuiEvents.OnVerifyUserAPITokenRequest}`, (data: unknown, cb: Function) => {
  emitNet(ServerEvents.OnVerifyUserAPITokenRequest, data);
  cb({ ok: true });
});

// the authentication flow has been closed
RegisterNuiCallbackType(NuiEvents.CloseAuthenticationFlow);
on(`__cfx_nui:${NuiEvents.CloseAuthenticationFlow}`, (_data: unknown, cb: Function) => {
  SetNuiFocus(false, false);
  cb({ ok: true });
});
