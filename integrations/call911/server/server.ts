import { cadRequest } from "~/utils/fetch.server";
import { Events } from "~/types/events";
import { getPostal } from "~/utils/postal/getPostal";
import { Post911CallsData } from "@snailycad/types/api";

const usePostal = GetConvar("snailycad_use_postal", "false") === "true";


export async function fetchActiveDispatchersCount(): Promise<number> {
  const response = await cadRequest<{ activeDispatchersCount: number }>({
    path: "/dispatch",
    method: "GET",
    responseType: "json",
  });

  if (response.error) {
    throw new Error(response.errorMessage || "Failed to fetch active dispatchers count");
  }

  return response.data?.activeDispatchersCount ?? 0;
}

RegisterCommand(
  '911',
  async (source: string, args: string[]) => {
    CancelEvent();

    const name = GetPlayerName(source);
    const description = args;

    try {
      const activeDispatchersCount = await fetchActiveDispatchersCount();

      if (activeDispatchersCount > 0) {
        setImmediate(() => {
          emitNet(Events.DispatcherinChannel, source);
        });
      } else {
        setImmediate(() => {
          emitNet(Events.Call911ToClient, source, { source, name, description });
        });
      }
    } catch (error) {
      console.error("Error fetching active dispatchers count:", error);
      setImmediate(() => {
        emitNet(Events.Call911ToClient, source, { source, name, description, error: "Unable to check dispatchers." });
      });
    }
  },
  false,
);


onNet(
  Events.Call911ToServer,
  async ({ source: player, street, name, description, position }: any) => {
    const postal = usePostal ? await getPostal(position) : null;

    const { data } = await cadRequest<Post911CallsData>({
      path: "/911-calls",
      method: "POST",
      data: {
        name,
        location: street,
        description: description.join(" "),
        postal,
        gtaMapPosition: {
          x: position.x,
          y: position.y,
          z: position.z,
          heading: position.heading,
        },
      },
    });

    if (data?.id) {
      emitNet(Events.Call911ToClientResponse, player, "success");

      emitNet(Events.Send911ToAll, -1, { name, description, position });
    } else {
      emitNet(Events.Call911ToClientResponse, player, "failed");
    }

    CancelEvent();
  },
);
