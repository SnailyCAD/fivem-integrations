import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

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
    postal: usePostal ? postal : null,
    creatorId: null,
  }).catch(console.error);

  CancelEvent();
});
