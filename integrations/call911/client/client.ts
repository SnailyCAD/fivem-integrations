import { createNotification } from "~/utils/notification";
import { TextureTypes } from "~/types/TextureTypes";
import { IconTypes } from "~/types/IconTypes";
import { Events } from "~/types/Events";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

onNet(Events.Call911ToClient, ({ name, description }: { name: string; description: string }) => {
  const [x, y, z] = GetEntityCoords(GetPlayerPed(-1), true);
  const [lastStreet] = GetStreetNameAtCoord(x!, y!, z!);
  const lastStreetName = GetStreetNameFromHashKey(lastStreet);

  if (usePostal) {
    // todo
    // lastStreetName = `${getPostal()} ${lastStreetName}`;
  }

  setImmediate(() => {
    emitNet(Events.Call911ToServer, { street: lastStreetName, name, description, x, y, z });
  });

  createNotification({
    picture: TextureTypes.CHAR_CALL911,
    icon: IconTypes.ChatBox,
    message: "Your call has been reported to the emergency services",
    title: "Emergency Services",
  });
});
