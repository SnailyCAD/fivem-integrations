import { createNotification } from "~/utils/notification";
import { TextureTypes } from "~/types/TextureTypes";
import { IconTypes } from "~/types/IconTypes";
import { Events } from "~/types/Events";
import { getPostal } from "~/utils/postal/getPostal";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

onNet(Events.TaxiCallToClient, ({ name, description }: { name: string; description: string }) => {
  const [x, y, z] = GetEntityCoords(GetPlayerPed(-1), true);
  const [lastStreet] = GetStreetNameAtCoord(x!, y!, z!);
  const lastStreetName = GetStreetNameFromHashKey(lastStreet);
  const postal = usePostal ? getPostal() : null;

  setImmediate(() => {
    emitNet(Events.TaxiCallToServer, {
      street: lastStreetName,
      postal,
      name,
      description,
      x,
      y,
      z,
    });
  });

  createNotification({
    picture: TextureTypes.CHAR_TAXI,
    icon: IconTypes.ChatBox,
    message: "Your call has been reported to any available taxi drivers!",
    title: "Taxi Service",
  });
});
