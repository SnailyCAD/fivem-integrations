import { TextureTypes } from "./types/TextureTypes";
import { createNotification } from "./utils/notification";

onNet("sn:cadPlateResults", (plate: string, body: any) => {
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
});
