import { cadRequest } from "~/utils/fetch.server";
import { getPlayerApiToken, prependSnailyCAD } from "../server";
import { ClientEvents, ServerEvents, SnCommands } from "~/types/events";
import { GetUserData, GetValuesData, PutDispatchStatusByUnitId } from "@snailycad/types/api";
import {
  CombinedEmsFdUnit,
  CombinedLeoUnit,
  EmsFdDeputy,
  Officer,
  StatusValue,
} from "@snailycad/types";

/**
 * when a player leaves the server, we want to set their status to off-duty
 * only if the feature is enabled
 */
onNet("playerDropped", async () => {
  const isFeatureEnabledConvar = GetConvar("snailycad_player_leave_auto_off_duty", "false");
  if (isFeatureEnabledConvar !== "true") return;

  const player = global.source;
  const userApiToken = getPlayerApiToken(player);

  const { data } = await cadRequest<GetUserData>({
    method: "POST",
    path: "/user?includeActiveUnit=true",
    headers: {
      userApiToken,
    },
  });

  // no active unit? => no need to continue
  if (!data?.unit) return;

  const { data: values } = await cadRequest<GetValuesData>({
    method: "GET",
    path: "/admin/values/codes_10?includeAll=true",
    headers: {
      userApiToken,
    },
  });

  const all10Codes =
    (values?.find((v) => v.type === "CODES_10")?.values as StatusValue[] | undefined) ?? null;
  const offDutyCode = all10Codes?.find((v) => v.shouldDo === "SET_OFF_DUTY") ?? null;

  if (offDutyCode) {
    await cadRequest<PutDispatchStatusByUnitId>({
      method: "PUT",
      path: `/dispatch/status/${data.unit.id}`,
      headers: {
        userApiToken,
      },
      data: {
        status: offDutyCode.id,
      },
    });
  }
});

/**
 * duty status
 */
RegisterCommand(
  SnCommands.ActiveUnit,
  async (source: number) => {
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

    if (!data.unit) {
      emitNet("chat:addMessage", source, {
        args: [
          prependSnailyCAD(
            "No active unit found. Go on-duty first in the SnailyCAD web interface.",
          ),
        ],
      });
      return;
    }

    const unitName = getUnitName(data.unit);
    const unitStatus = data.unit.status?.value.value ?? "None";

    emitNet("chat:addMessage", source, {
      args: [
        prependSnailyCAD(`Your active unit is ^5${unitName} ^7with status of ^5${unitStatus}^7.`),
      ],
    });
  },
  false,
);

RegisterCommand(
  SnCommands.SetStatus,
  async (source: number, extraArgs?: string[]) => {
    CancelEvent();

    const userApiToken = getPlayerApiToken(source);
    const { data } = await cadRequest<GetUserData>({
      method: "POST",
      path: "/user?includeActiveUnit=true",
      headers: {
        userApiToken,
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
        args: [
          prependSnailyCAD(
            "No active unit found. Go on-duty first in the SnailyCAD web interface.",
          ),
        ],
      });
      return;
    }

    const { data: values } = await cadRequest<GetValuesData>({
      method: "GET",
      path: "/admin/values/codes_10?includeAll=true",
      headers: {
        userApiToken,
      },
    });

    const all10Codes =
      (values?.find((v) => v.type === "CODES_10")?.values as StatusValue[] | undefined) ?? null;
    const statusCodes = all10Codes?.filter((v) => v.type === "STATUS_CODE") ?? [];

    const [statusCode] = extraArgs ?? [];

    if (statusCode) {
      const nearestStatusCode = statusCodes.find((v) =>
        v.value.value.toLowerCase().startsWith(statusCode.toLowerCase()),
      );

      if (!nearestStatusCode) {
        emitNet("chat:addMessage", source, {
          args: [prependSnailyCAD("An invalid status code was provided.")],
        });
        return;
      }

      emit(ServerEvents.OnSetUnitStatus, source, data.unit.id, nearestStatusCode.id);

      return;
    }

    emitNet(
      ClientEvents.RequestSetStatusFlow,
      source,
      data.unit.id,
      source,
      userApiToken,
      statusCodes,
    );
  },
  false,
);

onNet(
  ServerEvents.OnSetUnitStatus,
  async (source: number, unitId: string, statusCodeId: string) => {
    CancelEvent();

    const { data: updatedUnit } = await cadRequest<PutDispatchStatusByUnitId>({
      method: "PUT",
      path: `/dispatch/status/${unitId}`,
      headers: {
        userApiToken: getPlayerApiToken(source),
      },
      data: {
        status: statusCodeId,
      },
    });

    if (!updatedUnit?.id) {
      emitNet("chat:addMessage", source, {
        args: [prependSnailyCAD("An error occurred while updating your status.")],
      });

      return;
    }

    emitNet("chat:addMessage", source, {
      args: [
        prependSnailyCAD(`Your status has been updated to ^5${updatedUnit.status?.value.value}^7.`),
      ],
    });
  },
);

function getUnitName(unit: CombinedEmsFdUnit | CombinedLeoUnit | Officer | EmsFdDeputy) {
  if ("deputies" in unit || "officers" in unit) return "";
  return `${unit.citizen.name} ${unit.citizen.surname}`;
}
