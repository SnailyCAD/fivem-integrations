import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";

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

onNet(Events.Call911ToServer, async ({ street, postal, name, description }: any) => {
  await cadRequest("/911-calls", "POST", {
    name,
    location: street,
    description: description.join(" "),
    assignedUnits: [],
    postal,
  }).catch(console.error);

  CancelEvent();
});
