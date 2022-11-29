import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";
import { getPostal } from "~/utils/postal/getPostal";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

RegisterCommand(
  "calltaxi",
  (source: string, args: any[]) => {
    CancelEvent();

    const name = GetPlayerName(source);
    const description = args;

    setImmediate(() => {
      emitNet(Events.TaxiCallToClient, source, { source, name, description });
    });
  },
  false,
);

onNet(Events.TaxiCallToServer, async ({ street, name, position, description }: any) => {
  const postal = usePostal ? await getPostal(position) : null;

  await cadRequest("/taxi", "POST", {
    name,
    location: street,
    description: description.join(" "),
    postal,
    creatorId: null,
  }).catch(console.error);

  CancelEvent();
});
