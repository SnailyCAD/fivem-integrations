/**
 * unit status flow
 */

import { ClientEvents, ServerEvents, SnCommands } from "~/types/events";

emit("chat:addSuggestion", `/${SnCommands.TrafficStop}`, "TODO", [
  { name: "description", help: "The description of your traffic stop" },
]);

// request to open the 911 calls modal
onNet(
  ClientEvents.RequestTrafficStopFlow,
  (data: { unitId: string; source: number; name: string; description: string[] }) => {
    const playerPed = GetPlayerPed(-1);
    const [x, y, z] = GetEntityCoords(playerPed, true);
    const [lastStreet] = GetStreetNameAtCoord(x!, y!, z!);
    const lastStreetName = GetStreetNameFromHashKey(lastStreet);
    const heading = GetEntityHeading(PlayerPedId());

    setImmediate(() => {
      emitNet(ServerEvents.OnTrafficStopClientPosition, {
        ...data,
        streetName: lastStreetName,
        position: { x, y, z, heading },
      });
    });
  },
);
