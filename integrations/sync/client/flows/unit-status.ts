/**
 * unit status flow
 */

emit("chat:addSuggestion", "/sn-active-unit", "This will show your active unit's name and status.");
emit(
  "chat:addSuggestion",
  "/sn-set-status",
  "This will open a menu and will allow you to select a status for your active unit.",
);
