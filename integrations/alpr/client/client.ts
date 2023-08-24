import { GetBolosData, PostLeoSearchVehicleData } from "@snailycad/types/api";
import { ClientEvents, Events } from "~/types/events";

onNet(Events.ALPRCadBoloResults, (plate: string, body?: GetBolosData | "failed") => {
  if (!body || body === "failed") return;

  if (body.bolos.length > 0) {
    emit(ClientEvents.CreateNotification, {
      title: "Active Bolo Notice",
      message: `${plate} has an active BOLO. Open SnailyCAD for more details.`,
    });
  }
});

onNet(Events.ALPRCadPlateResults, (plate: string, body?: PostLeoSearchVehicleData[] | "failed") => {
  if (!body || body === "failed") {
    return emit(ClientEvents.CreateNotification, {
      message: "Unable to fetch plate search results: failed to fetch.",
      title: "Plate Search Results",
    });
  }

  const [vehicle] = body;
  if (!vehicle) {
    return emit(ClientEvents.CreateNotification, {
      message: `Plate is not registered: ${plate}`,
      title: "Plate Search Results",
    });
  }

  const owner = vehicle.citizen ? `${vehicle.citizen.name} ${vehicle.citizen.surname}` : "Unknown";
  const message = [
    `<li><b>Plate:</b> ${plate}</li>`,
    `<li><b>Model:</b> ${vehicle.model.value.value}</li>`,
    `<li><b>Color:</b> ${vehicle.color}</li>`,
    `<li><b>VIN Number:</b> ${vehicle.vinNumber}</li>`,
    `<li><b>Owner:</b> ${owner}</li>`,
  ];

  emit(ClientEvents.CreateNotification, {
    message: message.join("\n"),
    title: "Plate Search Results",
    timeout: 17_000,
  });

  const warrants = vehicle.citizen?.warrants?.filter((v: any) => v.status === "ACTIVE") ?? [];
  const hasWarrants = warrants.length > 0;

  if (hasWarrants) {
    const citizenFullName = `${vehicle.citizen?.name} ${vehicle.citizen?.surname}`;

    emit(ClientEvents.CreateNotification, {
      title: "Active Warrants Notice",
      message: `This vehicle - ${citizenFullName} - owner has active warrants.`,
    });
  }
});
