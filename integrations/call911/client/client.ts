import { createNotification } from "~/utils/notification";
import { TextureTypes } from "~/types/texture-types";
import { IconTypes } from "~/types/icon-types";
import { EventData, Events, SnCommands } from "~/types/events";

emit("chat:addSuggestion", `/${SnCommands.Call911}`, "Contact the emergency services.", [
  { name: "description", help: "The description of the call" },
]);

onNet(Events.Call911ToClient, ({ source, name, description }: EventData) => {
  const playerPed = GetPlayerPed(-1);
  const [x, y, z] = GetEntityCoords(playerPed, true);
  const [lastStreet] = GetStreetNameAtCoord(x!, y!, z!);
  const lastStreetName = GetStreetNameFromHashKey(lastStreet);
  const heading = GetEntityHeading(PlayerPedId());

  setImmediate(() => {
    emitNet(Events.Call911ToServer, {
      street: lastStreetName,
      name,
      description,
      position: { x, y, z, heading },
      source,
    });
  });
});

onNet(Events.Call911ToClientResponse, (state: "failed" | "success") => {
  if (state === "success") {
    createNotification({
      picture: TextureTypes.CHAR_CALL911,
      icon: IconTypes.ChatBox,
      message: "Your call has been reported to the emergency services",
      title: "Emergency Services",
    });
  } else {
    createNotification({
      picture: TextureTypes.CHAR_CALL911,
      icon: IconTypes.ChatBox,
      message: "We were unable to process your 911 call at this time.",
      title: "Failed to report call",
    });
  }
});
