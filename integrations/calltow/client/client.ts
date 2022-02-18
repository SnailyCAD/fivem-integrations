import { createNotification } from "~/utils/notification";
import { TextureTypes } from "~/types/TextureTypes";
import { IconTypes } from "~/types/IconTypes";
import { Events } from "~/types/Events";
import { getPostal } from "~/utils/postal/getPostal";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

onNet(Events.TowCallToClient, ({ name, description }: { name: string; description: string }) => {
  const [x, y, z] = GetEntityCoords(GetPlayerPed(-1), true);
  const [lastStreet] = GetStreetNameAtCoord(x!, y!, z!);
  let lastStreetName = GetStreetNameFromHashKey(lastStreet);

  if (usePostal) {
    lastStreetName = `${getPostal()} ${lastStreetName}`;
  }

  setImmediate(() => {
    emitNet(Events.TowCallToServer, { street: lastStreetName, name, description, x, y, z });
  });

  createNotification({
    picture: TextureTypes.CHAR_PROPERTY_TOWING_IMPOUND,
    icon: IconTypes.ChatBox,
    message: "Your Call has been reported to any available towers!",
    title: "Tow Truck Service",
  });
});
