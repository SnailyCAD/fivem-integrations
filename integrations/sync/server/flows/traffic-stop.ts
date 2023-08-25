import { cadRequest } from "~/utils/fetch.server";
import { getPlayerApiToken, prependSnailyCAD } from "../server";
import { ClientEvents, ServerEvents, SnCommands } from "~/types/events";
import { getPostal } from "~/utils/postal/getPostal";
import { GetUserData, Post911CallsData } from "@snailycad/types/api";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";

RegisterCommand(
  SnCommands.TrafficStop,
  async (source: number, description: string[]) => {
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
        args: [prependSnailyCAD("No active unit found. Go on-duty first.")],
      });
      return;
    }

    if (!description.length) {
      emitNet("chat:addMessage", source, {
        args: [prependSnailyCAD("Must provide a description for the traffic stop.")],
      });
      return;
    }

    // @ts-expect-error source is a string
    const name = GetPlayerName(source);

    emitNet(ClientEvents.RequestTrafficStopFlow, source, {
      unitId: data.unit.id,
      source,
      description,
      name,
    });

    CancelEvent();
  },
  false,
);

onNet(
  ServerEvents.OnTrafficStopClientPosition,
  async (data: {
    unitId: string;
    source: number;
    name: string;
    description: string[];
    position: any;
    streetName: string;
  }) => {
    const postal = usePostal ? await getPostal(data.position) : null;

    const { data: updatedCall } = await cadRequest<Post911CallsData>({
      method: "POST",
      path: "/911-calls",
      isFromDispatch: false,
      data: {
        name: data.name,
        location: data.streetName,
        description: data.description.join(" "),
        postal,
        gtaMapPosition: {
          x: data.position.x,
          y: data.position.y,
          z: data.position.z,
          heading: data.position.heading,
        },
        assignedUnits: [{ id: data.unitId, isPrimary: true }],
      },
      headers: {
        userApiToken: getPlayerApiToken(data.source),
      },
    });

    if (!updatedCall?.id) {
      emitNet("chat:addMessage", data.source, {
        args: [prependSnailyCAD("An error occurred while attaching you to the call.")],
      });

      return;
    }

    emitNet("chat:addMessage", data.source, {
      args: [
        prependSnailyCAD(
          `Successfully created a traffic stop call and assigned you to the call with the case number: ^5#${updatedCall.caseNumber}^7.`,
        ),
      ],
    });

    CancelEvent();
  },
);
