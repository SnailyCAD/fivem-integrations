import { ClientEvents } from "~/types/events";

const API_URL = GetConvar("snailycad_url", "null");

onNet(ClientEvents.RequestRegisterVehicleFlow, (data: { userApiToken: string }) => {
  const playerVehicleId = GetVehiclePedIsIn(PlayerPedId(), false);
  const plate = GetVehicleNumberPlateText(playerVehicleId);
  const color = GetVehicleColor(playerVehicleId);

  const vehicleModel = GetEntityModel(playerVehicleId);
  const vehicleModelName = GetDisplayNameFromVehicleModel(vehicleModel);
  console.log(playerVehicleId, plate, color, vehicleModelName);

  SendNuiMessage(
    JSON.stringify({
      action: ClientEvents.RequestRegisterVehicleFlow,
      data: {
        url: API_URL,
        plate,
        color,
        vehicleName: vehicleModelName,
        userApiToken: data.userApiToken,
      },
    }),
  );
  SetNuiFocus(true, true);
});
