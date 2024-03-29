import { ClientEvents, NuiEvents, ServerEvents, SnCommands } from "~/types/events";

const API_URL = GetConvar("snailycad_url", "null");

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
onNet(ClientEvents.RequestAuthFlow, () => {
  SendNuiMessage(
    JSON.stringify({ action: ClientEvents.RequestAuthFlow, data: { url: API_URL, source } }),
  );
  SetNuiFocus(true, true);
});

// the user has logged in successfully
RegisterNuiCallbackType(NuiEvents.OnAuthenticationFlowSuccess);
on(`__cfx_nui:${NuiEvents.OnAuthenticationFlowSuccess}`, (data: unknown, cb: Function) => {
  emitNet(ServerEvents.OnUserSave, data);
  cb({ ok: true });
});
