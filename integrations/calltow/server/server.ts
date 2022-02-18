import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";

RegisterCommand(
  "calltow",
  (source: string, args: any[]) => {
    CancelEvent();

    const name = GetPlayerName(source);
    const description = args;

    setImmediate(() => {
      emitNet(Events.TowCallToClient, -1, { source, name, description });
    });
  },
  false,
);

onNet(Events.TowCallToServer, async ({ street, postal, name, description }: any) => {
  await cadRequest("/tow", "POST", {
    name,
    location: street,
    description: description.join(" "),
    postal,
    creatorId: null,
  }).catch(console.error);

  CancelEvent();
});
