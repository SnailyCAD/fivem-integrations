import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/events";

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
    const { data } = await cadRequest({
      path: "/search/vehicle?includeMany=true",
      method: "POST",
      data: {
        plateOrVin: plate,
      },
    });

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(err);
    return "failed";
  }
}

async function fetchBoloSearch(plate: string) {
  try {
    const { data } = await cadRequest({
      path: `/bolos?query=${plate}`,
      method: "GET",
      data: {
        plateOrVin: plate,
      },
    });

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(err);
    return "failed";
  }
}
