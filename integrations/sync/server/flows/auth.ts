import { cadRequest } from "~/utils/fetch.server";
import { getPlayerIds } from "~/utils/get-player-ids.server";
import { getPlayerApiToken, prependSnailyCAD } from "../server";
import { ClientEvents, ServerEvents, SnCommands } from "~/types/events";
import { GetUserData } from "@snailycad/types/api";

/**
 * authentication flow
 */
RegisterCommand(
  SnCommands.WhoAmI,
  async (source: number) => {
    CancelEvent();

    const { data } = await cadRequest<GetUserData>({
      method: "POST",
      path: "/user",
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

    emitNet("chat:addMessage", source, {
      args: [prependSnailyCAD(`Your SnailyCAD username is ^5${data.username}^7.`)],
    });

    CancelEvent();
  },
  false,
);

RegisterCommand(
  SnCommands.Auth,
  (source: number) => {
    emitNet(ClientEvents.RequestAuthFlow, source);

    CancelEvent();
  },
  false,
);

onNet(ServerEvents.OnUserSave, async (userData: { token: string }) => {
  const identifiers = getPlayerIds(source, "object");
  if (!identifiers.license) {
    console.error("no license found");
    return;
  }

  SetResourceKvp(`snailycad:${identifiers.license}:token`, userData.token);
});
