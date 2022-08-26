import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";

onNet(Events.WraithPlateLocked, async (_cam: "front" | "rear", plate: string) => {
  const player = source;

  try {
    const response = await cadRequest("/search/vehicle?includeMany=true", "POST", {
      plateOrVin: plate,
    });

    const body = (await response?.body.json()) ?? null;

    if (Array.isArray(body)) {
      setImmediate(() => {
        emitNet(Events.ALPRCadPlateResults, player, plate, body);
      });
    } else {
      setImmediate(() => {
        emitNet(Events.ALPRCadPlateResults, player, plate, []);
      });
    }
  } catch (e) {
    console.error(e);
  }
});
