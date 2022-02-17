import { cadRequest } from "./utils/fetch";

onNet("wk:onPlateLocked", async (cam: "front" | "rear", plate: string, index: number) => {
  console.log("hello world");
  console.log({ cam, plate, index });

  const response = await cadRequest("/search/vehicle?includeMany=true", "POST", {
    plateOrVin: plate,
  });

  const body = (await response?.body.json()) ?? null;
  console.log({ body });

  setImmediate(() => {
    emitNet("sn:cadPlateResults", -1, plate, body);
  });
});
