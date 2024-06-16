import { AssignedUnit, Call911 } from "@snailycad/types";
import { ClientEvents, SnCommands } from "~/types/events";

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
  (
    unitId: string,
    source: number,
    calls: (Call911 & { assignedUnits?: AssignedUnit[] })[],
    userApiToken: string,
  ) => {
    SendNuiMessage(
      JSON.stringify({
        action: ClientEvents.RequestCall911AttachFlow,
        data: { url: API_URL, userApiToken, source, unitId, calls },
      }),
    );
    SetNuiFocus(true, true);
  },
);

var POSTAL_COMMAND_DEFAULT = GetConvar("postal_command", "null");
onNet("sna-sync:attach-postal", (
  postal: string
) => {
  const PostalCode = Number(postal);

  if (POSTAL_COMMAND_DEFAULT === "null") {
    console.error(`
    ---------------------------------------
  
  [${GetCurrentResourceName()}] Failed to find the "postal_command" convar in your server.cfg. Please make sure you are using \`setr\` and not \`set\`:
  
  \`setr postal_command "<your-command-here>" \`
  
    ---------------------------------------`);
  };

  if (PostalCode != null && PostalCode > 0){
    ExecuteCommand(`${POSTAL_COMMAND_DEFAULT} ${PostalCode}`);
  } else {
    emit('chat:addMessage', {
      color: [255, 0, 0],
      multiline: true,
      args: ['SnailyCAD', 'An error occured while making route to call postal']
    });
  };
})
