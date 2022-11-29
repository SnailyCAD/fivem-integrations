import { createNotification } from "~/utils/notification";
import { TextureTypes } from "~/types/TextureTypes";
import { IconTypes } from "~/types/IconTypes";
import { EventData, Events } from "~/types/Events";

onNet(Events.TaxiCallToClient, async ({ name, description }: EventData) => {
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
    });
  });

  createNotification({
    picture: TextureTypes.CHAR_TAXI,
    icon: IconTypes.ChatBox,
    message: "Your call has been reported to any available taxi drivers!",
    title: "Taxi Service",
  });
});
