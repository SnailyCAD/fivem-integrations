import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/Events";

onNet(Events.WraithPlateLocked, async (_cam: "front" | "rear", plate: string) => {
  const player = source;

  const plateSearchResults = await fetchVehicleSearch(plate.trim().toUpperCase());
  const boloSearchResults = await fetchBoloSearch(plate.trim().toUpperCase());

  setImmediate(() => {
    emitNet(Events.ALPRCadPlateResults, player, plate.trim().toUpperCase(), plateSearchResults);
  });

  setImmediate(() => {
    emitNet(Events.ALPRCadBoloResults, player, plate.trim().toUpperCase(), boloSearchResults);
  });
});

async function fetchVehicleSearch(plate: string) {
  try {
    const response = await cadRequest("/search/vehicle?includeMany=true", "POST", {
      plateOrVin: plate,
    });

    const body = (await response?.body.json()) ?? null;
    return Array.isArray(body) ? body : [];
  } catch (err) {
    console.error(err);
    return "failed";
  }
}

async function fetchBoloSearch(plate: string) {
  try {
    const response = await cadRequest(`/bolos?query=${plate}`, "GET");

    const body = (await response?.body.json()) ?? null;
    return Array.isArray(body) ? body : [];
  } catch (err) {
    console.error(err);
    return "failed";
  }
}
