import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";
import { getPostal } from "~/utils/postal/getPostal";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

RegisterCommand(
  "calltow",
  (source: string, args: any[]) => {
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

    const { data } = await cadRequest<{ id: string }>({
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
