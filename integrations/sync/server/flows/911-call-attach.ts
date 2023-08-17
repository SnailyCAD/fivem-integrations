import { cadRequest } from "~/utils/fetch.server";
import { getPlayerApiToken, prependSnailyCAD } from "../server";
import { ClientEvents, ServerEvents, SnCommands } from "~/types/events";
import { User } from "./auth";
import { getPlayerIds } from "~/utils/get-player-ids.server";

RegisterCommand(
  SnCommands.AttachTo911Call,
  async (source: number, extraArgs?: string[]) => {
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

    const [caseNumber] = extraArgs ?? [];
    if (caseNumber) {
      console.log("caseNumber", caseNumber);

      const { data: call } = await cadRequest<{ id: string }>({
        method: "GET",
        path: `/911-calls/${caseNumber}`,
        headers: {
          userApiToken: getPlayerApiToken(source),
        },
      });

      if (!call?.id) {
        emitNet("chat:addMessage", source, {
          args: [
            prependSnailyCAD("That call could not be found. Please try a different case-number."),
          ],
        });
        return;
      }

      emit(ServerEvents.OnCall911Attach, source, data.unit.id, call.id);
      return;
    }

    const identifiers = getPlayerIds(source, "array");
    emitNet(ClientEvents.RequestCall911AttachFlow, source, data.unit.id, source, identifiers);
  },
  false,
);

onNet(ServerEvents.OnCall911Attach, async (source: number, unitId: string, callId: string) => {
  const { data: updatedCall } = await cadRequest<{ id: string; caseNumber: number }>({
    method: "POST",
    path: `/911-calls/assign/${callId}`,
    data: {
      unit: unitId,
    },
    headers: {
      userApiToken: getPlayerApiToken(source),
    },
  });

  if (!updatedCall?.id) {
    emitNet("chat:addMessage", source, {
      args: [prependSnailyCAD("An error occurred while attaching you to the call.")],
    });

    return;
  }

  emitNet("chat:addMessage", source, {
    args: [
      prependSnailyCAD(
        `Successfully attached you to the call with case number: #${updatedCall.caseNumber}.`,
      ),
    ],
  });
});
