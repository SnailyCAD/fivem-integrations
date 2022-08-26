import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";

onNet(Events.WraithPlateLocked, async (_cam: "front" | "rear", plate: string) => {
  const player = source;
  console.log(`${player} has locked ${plate}`);

  try {
    const response = await cadRequest("/search/vehicle?includeMany=true", "POST", {
      plateOrVin: plate,
    });

    const body = (await response?.body.json()) ?? null;

    if (Array.isArray(body)) {
      console.log(body);

      setImmediate(() => {
        emitNet(Events.ALPRCadPlateResults, player, plate, body);
      });
    } else {
      console.log("Invalid Request to CAD TODO: Add error handling");
    }
  } catch (e) {
    console.error(e);
  }
});
