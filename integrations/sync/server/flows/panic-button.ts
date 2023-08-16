import { cadRequest } from "~/utils/fetch.server";
import { getPlayerApiToken, prependSnailyCAD } from "../server";
import { SnCommands } from "~/types/events";
import { User } from "./auth";

RegisterCommand(
  SnCommands.PanicButton,
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

    const isOfficer = "divisions" in data.unit && Array.isArray(data.unit.divisions);
    const path = isOfficer ? "/leo/panic-button" : "/ems-fd/panic-button";
    const dataKey = isOfficer ? "officerId" : "deputyId";

    const { data: updatedUnit } = await cadRequest<{ id: string; status: any }>({
      method: "POST",
      path,
      data: {
        [dataKey]: data.unit.id,
      },
      headers: {
        userApiToken: getPlayerApiToken(source),
      },
    });

    if (!updatedUnit?.id) {
      emitNet("chat:addMessage", source, {
        args: [prependSnailyCAD("An error occurred while updating your status.")],
      });

      return;
    }

    const isCurrentlyInPanicButtonState = updatedUnit.status?.shouldDo === "PANIC_BUTTON";

    emitNet("chat:addMessage", source, {
      args: [
        prependSnailyCAD(
          `You successfully ${
            isCurrentlyInPanicButtonState ? "enabled" : "disabled"
          } your panic button`,
        ),
      ],
    });
  },
  false,
);
