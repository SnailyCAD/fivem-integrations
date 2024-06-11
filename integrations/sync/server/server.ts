import { getPlayerIds } from "~/utils/get-player-ids.server";
import "./flows/auth";
import "./flows/unit-status";
import "./flows/panic-button";
import "./flows/911-call-attach";
import "./flows/traffic-stop";
import "./flows/incoming-911-call";

export function prependSnailyCAD(text: string) {
  return `^8^*[SnailyCAD]:^7^r ${text}`;
}

export function getPlayerApiToken(source: number) {
  const identifiers = getPlayerIds(source, "object");
  const userLicense = identifiers.license;
  const apiToken = GetResourceKvpString(`snailycad:${userLicense}:token`);

  return apiToken;
}
