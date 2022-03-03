import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";

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

onNet(Events.TaxiCallToServer, async ({ street, postal, name, description }: any) => {
  await cadRequest("/taxi", "POST", {
    name,
    location: street,
    description: description.join(" "),
    postal,
    creatorId: null,
  }).catch(console.error);

  CancelEvent();
});
