import { cadRequest } from "~/utils/fetch.server";
import { getPlayerApiToken, prependSnailyCAD } from "../server";
import { getPlayerIds } from "~/utils/get-player-ids.server";

// todo: add general docs for this plugin.

/**
 * duty status
 */
export interface User {
  id: string;
  username: string;
  steamId: string | null;
  discordId: string | null;
  permissions: string[];
}

RegisterCommand(
  "sn-active-unit",
  async (source: number) => {
    CancelEvent();

    const { data } = await cadRequest<User & { unit: any }>({
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

    if (!data.unit) {
      emitNet("chat:addMessage", source, {
        args: [prependSnailyCAD("No active unit found. Go on-duty first.")],
      });
      return;
    }

    emitNet("chat:addMessage", source, {
      args: [prependSnailyCAD(`Your active unit is ^5${"test"} ^7with status of ^5${"10-9"}^7.`)],
    });
  },
  false,
);

RegisterCommand(
  "sn-set-status",
  async (source: number) => {
    CancelEvent();

    const { data } = await cadRequest<User & { unit: any }>({
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

    if (!data.unit) {
      emitNet("chat:addMessage", source, {
        args: [prependSnailyCAD("No active unit found. Go on-duty first.")],
      });
      return;
    }

    const identifiers = getPlayerIds(source, "array");
    emitNet("sna-sync:request-set-status-flow", source, identifiers);
  },
  false,
);
