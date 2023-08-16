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

    const unitName = getUnitName(data.unit);
    const unitStatus = data.unit.status?.value?.value ?? "None";

    emitNet("chat:addMessage", source, {
      args: [
        prependSnailyCAD(`Your active unit is ^5${unitName} ^7with status of ^5${unitStatus}^7.`),
      ],
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

    const { data: values } = await cadRequest<{ type: string; values: any[] }[]>({
      method: "GET",
      path: "/admin/values/codes_10?includeAll=true",
      headers: {
        userApiToken: getPlayerApiToken(source),
      },
    });

    const all10Codes = values?.find((v) => v.type === "CODES_10") ?? null;

    const statusCodes = all10Codes?.values.filter((v) => v.type === "STATUS_CODE") ?? [];

    console.log(JSON.stringify({ all10Codes, statusCodes }, null, 4));

    const identifiers = getPlayerIds(source, "array");
    emitNet("sna-sync:request-set-status-flow", source, identifiers, statusCodes);
  },
  false,
);

function getUnitName(unit: any) {
  if ("deputies" in unit || "officers" in unit) return "";
  if (!unit.citizen) return "Unknown";
  return `${unit.citizen.name} ${unit.citizen.surname}`;
}
