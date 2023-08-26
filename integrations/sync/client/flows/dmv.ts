import { ClientEvents } from "~/types/events";

const API_URL = GetConvar("snailycad_url", "null");

onNet(ClientEvents.RequestRegisterVehicleFlow, (data: { vehicleId: number }) => {
  const plate = GetVehicleNumberPlateText(data.vehicleId);
  const color = GetVehicleColor(data.vehicleId);

  const vehicleModel = GetEntityModel(data.vehicleId);
  const vehicleModelName = GetDisplayNameFromVehicleModel(vehicleModel);
  console.log(plate, color, vehicleModelName);

  SendNuiMessage(
    JSON.stringify({
      action: ClientEvents.RequestRegisterVehicleFlow,
      data: { url: API_URL, plate, color, vehicleName: vehicleModelName },
    }),
  );
});
