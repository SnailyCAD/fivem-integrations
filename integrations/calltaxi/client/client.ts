import { createNotification } from "~/utils/notification";
import { TextureTypes } from "~/types/TextureTypes";
import { IconTypes } from "~/types/IconTypes";
import { EventData, Events } from "~/types/Events";

emit("chat:addSuggestion", "/calltaxi ", "Contact the taxi services (SnailyCAD).", [
  { name: "description", help: "The description of the call" },
]);

onNet(Events.TaxiCallToClient, async ({ source, name, description }: EventData) => {
  const playerPed = GetPlayerPed(-1);
  const [x, y, z] = GetEntityCoords(playerPed, true);
  const [lastStreet] = GetStreetNameAtCoord(x!, y!, z!);
  const lastStreetName = GetStreetNameFromHashKey(lastStreet);

  setImmediate(() => {
    emitNet(Events.TaxiCallToServer, {
      street: lastStreetName,
      name,
      description,
      position: { x, y, z },
      source,
    });
  });
});

onNet(Events.TaxiCallToClientResponse, (state: "failed" | "success") => {
  if (state === "success") {
    createNotification({
      picture: TextureTypes.CHAR_TAXI,
      icon: IconTypes.ChatBox,
      message: "Your call has been reported to any available taxi drivers!",
      title: "Taxi Service",
    });
  } else {
    createNotification({
      picture: TextureTypes.CHAR_TAXI,
      icon: IconTypes.ChatBox,
      message: "We were unable to process your taxi call at this time.",
      title: "Failed to report call",
    });
  }
});
