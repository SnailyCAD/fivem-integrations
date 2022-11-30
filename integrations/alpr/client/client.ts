import { TextureTypes } from "~/types/TextureTypes";
import { createNotification } from "~/utils/notification";
import { Events } from "~/types/Events";

onNet(Events.ALPRCadBoloResults, (plate: string, body: any[] | null) => {
  if (body && body.length > 0) {
    createNotification({
      title: "BOLO Results",
      message: `${plate} has an active BOLO. Open SnailyCAD for more details.`,
      picture: TextureTypes.CHAR_CALL911,
    });
  }
});

onNet(Events.ALPRCadPlateResults, (plate: string, body: any[] | null) => {
  const vehicle = body?.[0];

  if (!vehicle) {
    return createNotification({
      picture: TextureTypes.CHAR_CALL911,
      message: `Plate is not registered: ${plate}`,
      title: "Plate Search Results",
    });
  }

  const message = [
    `Plate: ${plate}`,
    `Model: ${vehicle.model.value?.value ?? "N/A"}`,
    `Color: ${vehicle.color}`,
    `VIN Number: ${vehicle.vinNumber}`,
    `Owner: ${vehicle.citizen.name} ${vehicle.citizen.surname}`,
  ];

  createNotification({
    picture: TextureTypes.CHAR_CALL911,
    message: message.join("\n"),
    title: "Plate Search Results",
  });

  const warrants = vehicle.citizen?.warrants?.filter((v: any) => v.status === "ACTIVE");
  const hasWarrants = warrants?.length > 0;

  if (hasWarrants) {
    createNotification({
      picture: TextureTypes.CHAR_CALL911,
      message: "This vehicle owner has active warrants",
      title: "Active Warrants",
    });
  }
});
