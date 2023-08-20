/**
 * unit status flow
 */

import { ClientEvents, ServerEvents, SnCommands } from "~/types/events";

emit(
  "chat:addSuggestion",
  `/${SnCommands.TrafficStop}`,
  "Create a call with your current position and be assigned as primary unit.",
  [{ name: "description", help: "The description of your traffic stop" }],
);

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
