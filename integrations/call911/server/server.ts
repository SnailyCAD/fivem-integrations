import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";
import { getPostal } from "~/utils/postal/getPostal";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

RegisterCommand(
  "call911",
  (source: string, args: any[]) => {
    CancelEvent();

    const name = GetPlayerName(source);
    const description = args;

    setImmediate(() => {
      emitNet(Events.Call911ToClient, source, { source, name, description });
    });
  },
  false,
);

onNet(
  Events.Call911ToServer,
  async ({ source: player, street, name, description, position }: any) => {
    const postal = usePostal ? await getPostal(position) : null;

    const response = await cadRequest("/911-calls", "POST", {
      name,
      location: street,
      description: description.join(" "),
      postal,
      gtaMapPosition: {
        x: position.x,
        y: position.y,
        z: position.z,
        heading: position.heading,
      },
    }).catch((error) => {
      console.error(error);
      return null;
    });

    if (response?.statusCode === 200) {
      emitNet(Events.Call911ToClientResponse, player, "success");
    } else {
      emitNet(Events.Call911ToClientResponse, player, "failed");
    }

    CancelEvent();
  },
);
