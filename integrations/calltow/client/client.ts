import { createNotification } from "~/utils/notification";
import { TextureTypes } from "~/types/TextureTypes";
import { IconTypes } from "~/types/IconTypes";
import { EventData, Events } from "~/types/Events";

onNet(Events.TowCallToClient, async ({ name, description }: EventData) => {
  const playerPed = GetPlayerPed(-1);
  const [x, y, z] = GetEntityCoords(playerPed, true);
  const [lastStreet] = GetStreetNameAtCoord(x!, y!, z!);
  const lastStreetName = GetStreetNameFromHashKey(lastStreet);

  setImmediate(() => {
    emitNet(Events.TowCallToServer, {
      street: lastStreetName,
      name,
      description,
      position: { x, y, z },
    });
  });

  createNotification({
    picture: TextureTypes.CHAR_PROPERTY_TOWING_IMPOUND,
    icon: IconTypes.ChatBox,
    message: "Your Call has been reported to any available towers!",
    title: "Tow Truck Service",
  });
});
