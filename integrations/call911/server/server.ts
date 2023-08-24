import { cadRequest } from "~/utils/fetch.server";
import { Events, SnCommands } from "~/types/events";
import { getPostal } from "~/utils/postal/getPostal";
import { Post911CallsData } from "@snailycad/types/api";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

RegisterCommand(
  SnCommands.Call911,
  (source: string, args: string[]) => {
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

    const { data } = await cadRequest<Post911CallsData>({
      path: "/911-calls",
      method: "POST",
      data: {
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
      },
    });

    if (data?.id) {
      emitNet(Events.Call911ToClientResponse, player, "success");
    } else {
      emitNet(Events.Call911ToClientResponse, player, "failed");
    }

    CancelEvent();
  },
);
