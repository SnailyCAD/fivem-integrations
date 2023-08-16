export function prependSnailyCAD(text: string) {
  return `^8^*[SnailyCAD]:^7^r ${text}`;
}

export function getPlayerApiToken(source: number) {
  const identifiers = getPlayerIds(source, "object");
  const userId = identifiers.license;
  const apiToken = GetResourceKvpString(`snailycad:${userId}:token`);

  return apiToken;
}

import { getPlayerIds } from "~/utils/get-player-ids.server";
import "./flows/auth";
import "./flows/unit-status";
