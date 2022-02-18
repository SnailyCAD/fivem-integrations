import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";

RegisterCommand(
  "call911",
  (source: string, args: any[]) => {
    CancelEvent();

    const name = GetPlayerName(source);
    const description = args;

    setImmediate(() => {
      emitNet(Events.Call911ToClient, -1, { source, name, description });
    });
  },
  false,
);

onNet(Events.Call911ToServer, ({ street, name, description }: any) => {
  cadRequest("/911-calls", "POST", {
    name,
    location: street,
    description: description.join(" "),
    assignedUnits: [],
  }).catch(console.error);

  CancelEvent();
});
