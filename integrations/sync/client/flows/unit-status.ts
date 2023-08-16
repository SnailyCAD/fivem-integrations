/**
 * unit status flow
 */

// @ts-expect-error will not be duplicated in the final build/bundle
const API_URL = GetConvar("snailycad_url", "null");

emit("chat:addSuggestion", "/sn-active-unit", "This will show your active unit's name and status.");
emit(
  "chat:addSuggestion",
  "/sn-set-status",
  "This will open a menu and will allow you to select a status for your active unit.",
  [{ name: "status-code", help: "The status code you want to set." }],
);

// request to open the set status modal
onNet("sna-sync:request-set-status-flow", (identifiers: string[], statusCodes: any[]) => {
  SendNuiMessage(
    JSON.stringify({
      action: "sn:request-set-status-flow",
      data: { url: API_URL, source, identifiers, statusCodes },
    }),
  );
  SetNuiFocus(true, true);
});
