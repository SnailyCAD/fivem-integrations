/**
 * unit status flow
 */

emit("chat:addSuggestion", "/sn-active-unit", "This will show your active unit's name and status.");
emit(
  "chat:addSuggestion",
  "/sn-set-status",
  "This will open a menu and will allow you to select a status for your active unit.",
);

// request to open the set status modal
onNet("sna-sync:request-set-status-flow", (identifiers: string[]) => {
  SendNuiMessage(
    JSON.stringify({
      action: "sn:request-set-status-flow",
      // todo: pass in the 10-codes and unit
      data: { url: API_URL, source, identifiers },
    }),
  );
  SetNuiFocus(true, true);
});
