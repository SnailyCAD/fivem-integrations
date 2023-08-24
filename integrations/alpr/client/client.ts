import { TextureTypes } from "~/types/texture-types";
import { createNotification } from "~/utils/notification";
import { GetBolosData, PostLeoSearchVehicleData } from "@snailycad/types/api";
import { Events } from "~/types/events";

onNet(Events.ALPRCadBoloResults, (plate: string, body?: GetBolosData | "failed") => {
  if (!body || body === "failed") return;

  if (body.bolos.length > 0) {
    createNotification({
      title: "BOLO Results",
      message: `${plate} has an active BOLO. Open SnailyCAD for more details.`,
      picture: TextureTypes.CHAR_CALL911,
    });
  }
});

onNet(Events.ALPRCadPlateResults, (plate: string, body?: PostLeoSearchVehicleData[] | "failed") => {
  if (!body || body === "failed") {
    return createNotification({
      picture: TextureTypes.CHAR_CALL911,
      message: "Unable to fetch plate search results: failed to fetch",
      title: "Plate Search Results",
    });
  }

  const [vehicle] = body;
  if (!vehicle) {
    return createNotification({
      picture: TextureTypes.CHAR_CALL911,
      message: `Plate is not registered: ${plate}`,
      title: "Plate Search Results",
    });
  }

  const owner = vehicle.citizen ? `${vehicle.citizen.name} ${vehicle.citizen.surname}` : "Unknown";
  const message = [
    `Plate: ${plate}`,
    `Model: ${vehicle.model.value.value}`,
    `Color: ${vehicle.color}`,
    `VIN Number: ${vehicle.vinNumber}`,
    `Owner: ${owner}`,
  ];

  createNotification({
    picture: TextureTypes.CHAR_CALL911,
    message: message.join("\n"),
    title: "Plate Search Results",
  });

  const warrants = vehicle.citizen?.warrants?.filter((v: any) => v.status === "ACTIVE") ?? [];
  const hasWarrants = warrants.length > 0;

  if (hasWarrants) {
    createNotification({
      picture: TextureTypes.CHAR_CALL911,
      message: "This vehicle owner has active warrants",
      title: "Active Warrants",
    });
  }
});
