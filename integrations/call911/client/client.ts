import { EventData, Events, SnCommands } from "~/types/events";
import { getPostal } from "~/utils/postal/getPostal";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

emit("chat:addSuggestion", `/${SnCommands.Call911}`, "Contact the emergency services.", [
  { name: "description", help: "The description of the call" },
]);

onNet(Events.Call911ToClient, ({ source, name, description }: EventData) => {
  const playerPed = GetPlayerPed(-1);
  const [x, y, z] = GetEntityCoords(playerPed, true);
  const [lastStreet] = GetStreetNameAtCoord(x!, y!, z!);
  const lastStreetName = GetStreetNameFromHashKey(lastStreet);
  const heading = GetEntityHeading(PlayerPedId());

  setImmediate(() => {
    emitNet(Events.Call911ToServer, {
      street: lastStreetName,
      name,
      description,
      position: { x, y, z, heading },
      source,
    });
  });
});

onNet(Events.DispatcherinChannel, () => {
    TriggerEvent('chat:addMessage', {
      color: [255, 255, 255],
      multiline: true,
      args: ["^1 [Emergency Services]", "^7 There is an active dispatcher in channel please join the 911 Call Center on Teamspeak."]
  })
});

onNet(Events.Call911ToClientResponse, ((state: "failed" | "success") => {
  if (state === "success") {
    TriggerEvent('chat:addMessage', {
      color: [255, 255, 255],
      multiline: true,
      args: ["^1 [Emergency Services]", "^7 Your 911 has been reported to any available emergency services!"]
  });
  } else {
    TriggerEvent('chat:addMessage', {
      color: [255, 255, 255],
      multiline: true,
      args: ["^1 [Emergency Services]", "^7 We were unable to process your 911 call at this time."]
  });
  }
}));

onNet(Events.Send911ToAll, async ({ name, description, position }: { name: string; description: string } & { position: any }) => {

  const postal = usePostal ? await getPostal(position) : null;
  
  const playerPed: number = GetPlayerPed(-1);
  const [x, y, z]: number[] = GetEntityCoords(playerPed, true);
  const [lastStreet]: number[] = GetStreetNameAtCoord(x!, y!, z!);
  const lastStreetName: string = GetStreetNameFromHashKey(lastStreet);

  TriggerEvent('chat:addMessage', {
    color: [255, 255, 255],
    multiline: true,
    args: [
      "^1 [911]", 
      "^7" + name + " | Call Description: " + description + " | Postal: " + postal + " | Street: " + lastStreetName
    ]
  });
});
