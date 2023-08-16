/**
 * authentication flow
 */

const API_URL = GetConvar("snailycad_url", "null");

// add client command suggestion
emit(
  "chat:addSuggestion",
  "/sn-whoami",
  "Shows your current SnailyCAD account username and ID that is connected to the game.",
);

emit(
  "chat:addSuggestion",
  "/sn-auth",
  "Authenticate with your personal SnailyCAD API Token to interact with parts of it.",
);

// request to show the authentication flow modal
onNet("sna-sync:request-authentication-flow", (identifiers: string[]) => {
  SendNuiMessage(
    JSON.stringify({
      action: "sn:request-authentication-flow",
      data: { url: API_URL, source, identifiers },
    }),
  );
  SetNuiFocus(true, true);
});

// the user has logged in successfully
RegisterNuiCallbackType("sna-sync:authentication-flow-success");
on("__cfx_nui:sna-sync:authentication-flow-success", (data: unknown, cb: Function) => {
  emitNet("sna-sync:request-user-save", data);
  cb({ ok: true });
});

// the authentication flow has been closed
RegisterNuiCallbackType("sna-sync:close-authentication-flow");
on("__cfx_nui:sna-sync:close-authentication-flow", (_data: unknown, cb: Function) => {
  SetNuiFocus(false, false);
  cb({ ok: true });
});
