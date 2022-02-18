import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";

onNet(Events.WraithPlateLocked, async (_cam: "front" | "rear", plate: string) => {
  const response = await cadRequest("/search/vehicle?includeMany=true", "POST", {
    plateOrVin: plate,
  });

  const body = (await response?.body.json()) ?? null;

  setImmediate(() => {
    emitNet(Events.ALPRCadPlateResults, -1, plate, body);
  });
});
