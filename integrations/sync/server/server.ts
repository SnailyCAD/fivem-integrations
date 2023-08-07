import { cadRequest } from "~/utils/fetch.server";
import { getPlayerIds } from "~/utils/get-player-ids.server";

type Response = {
  id: string;
  username: string;
  steamId: string | null;
  discordId: string | null;
  permissions: string[];
  // todo: add types
  unit: any;
} | null;

RegisterCommand(
  "whoami",
  async (source: number) => {
    CancelEvent();

    const identifiers = getPlayerIds(source);
    const response = await cadRequest("/dispatch/player", "POST", identifiers).catch((error) => {
      console.error(error);
      return null;
    });

    console.log("identifiers", identifiers);

    const data = (await response?.body.json()) as Response;

    console.log(data);

    if (!data) {
      // todo: send client event that user doesn't exist
      return;
    }

    emitNet("chat:addMessage", source, {
      args: [`Your username is ${data.username} and user ID is ${data.id}`],
    });
  },
  false,
);

/**
 * authentication flow
 */

RegisterCommand(
  "authenticate",
  (source: number) => {
    CancelEvent();

    emitNet("sna-sync:request-authentication-flow", source);
  },
  false,
);

onNet("sna-sync:request-user-save", async (userData: unknown) => {
  console.log("user", userData);

  // todo: validate user input
  // todo: save in SQLite database
});
