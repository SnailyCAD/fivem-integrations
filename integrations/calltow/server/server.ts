import { cadRequest } from "~/utils/fetch.server";
import { Events, SnCommands } from "~/types/events";
import { getPostal } from "~/utils/postal/getPostal";
import { PostTowCallsData } from "@snailycad/types/api";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

RegisterCommand(
  SnCommands.CallTow,
  (source: string, args: string[]) => {
    CancelEvent();

    const name = GetPlayerName(source);
    const description = args;

    setImmediate(() => {
      emitNet(Events.TowCallToClient, source, { source, name, description });
    });
  },
  false,
);

onNet(
  Events.TowCallToServer,
  async ({ source: player, street, name, position, description }: any) => {
    const postal = usePostal ? await getPostal(position) : null;

    const { data } = await cadRequest<PostTowCallsData>({
      path: "/tow",
      method: "POST",
      data: {
        name,
        location: street,
        description: description.join(" "),
        postal,
        creatorId: null,
      },
    });

    if (data?.id) {
      emitNet(Events.TowCallToClientResponse, player, "success");
    } else {
      emitNet(Events.TowCallToClientResponse, player, "failed");
    }

    CancelEvent();
  },
);
