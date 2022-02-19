import { TextureTypes } from "~/types/TextureTypes";
import { createNotification } from "~/utils/notification";
import { Events } from "~/types/Events";

onNet(Events.ALPRCadPlateResults, (plate: string, body: any) => {
  const [vehicle] = body ?? [];

  if (!vehicle) {
    return createNotification({
      picture: TextureTypes.CHAR_CALL911,
      message: `No vehicle found with plate: ${plate}`,
      title: "Plate Search Results",
    });
  }

  const message = [
    `Plate: ${plate}`,
    `Model: ${vehicle.model.value?.value ?? "N/A"}`,
    `Color: ${vehicle.color}`,
    `Vin Number: ${vehicle.vinNumber}`,
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
