import { cadRequest } from "./utils/fetch";

onNet("wk:onPlateLocked", async (_cam: "front" | "rear", plate: string) => {
  const response = await cadRequest("/search/vehicle?includeMany=true", "POST", {
    plateOrVin: plate,
  });

  const body = (await response?.body.json()) ?? null;

  setImmediate(() => {
    emitNet("sn:cadPlateResults", -1, plate, body);
  });
});
