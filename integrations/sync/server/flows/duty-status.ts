import { cadRequest } from "~/utils/fetch.server";
import { getPlayerApiToken, prependSnailyCAD } from "../server";

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

    const response = await cadRequest("/user?includeActiveUnit=true", "POST", {
      userApiToken: getPlayerApiToken(source),
    }).catch((error) => {
      console.error(error);
      return null;
    });

    const data = (await response?.body.json()) as (User & { unit: any }) | null;

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
