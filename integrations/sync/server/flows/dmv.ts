import { cadRequest } from "~/utils/fetch.server";
import { getPlayerApiToken, prependSnailyCAD } from "../server";
import { ClientEvents, SnCommands } from "~/types/events";
import { GetUserData } from "@snailycad/types/api";

RegisterCommand(
  SnCommands.RegisterVehicle,
  async (source: string) => {
    CancelEvent();

    const { data } = await cadRequest<GetUserData>({
      method: "POST",
      path: "/user?includeActiveUnit=true",
      headers: {
        userApiToken: getPlayerApiToken(source),
      },
    });

    if (!data?.id) {
      emitNet("chat:addMessage", source, {
        args: [prependSnailyCAD("Please make sure you're authenticated. Use: ^5/sn-auth^7.")],
      });
      return;
    }

    const playerVehicle = GetVehiclePedIsIn(GetPlayerPed(source), false);

    if (!playerVehicle) {
      emitNet("chat:addMessage", source, {
        args: [prependSnailyCAD("You're not in a vehicle.")],
      });
      return;
    }

    emitNet(ClientEvents.RequestRegisterVehicleFlow, source, { source, vehicleId: playerVehicle });
  },
  false,
);

// onNet(ServerEvents.OnTrafficStopClientPosition, async (data: {}) => {
//   cancelEvent();
// });
