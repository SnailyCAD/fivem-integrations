import { createNotification } from "~/utils/notification";
import { TextureTypes } from "~/types/TextureTypes";
import { IconTypes } from "~/types/IconTypes";
import { EventData, Events } from "~/types/Events";

onNet(Events.Call911ToClient, ({ name, description }: EventData) => {
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
    });
  });

  createNotification({
    picture: TextureTypes.CHAR_CALL911,
    icon: IconTypes.ChatBox,
    message: "Your call has been reported to the emergency services",
    title: "Emergency Services",
  });
});
