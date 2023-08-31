import { ClientEvents, NuiEvents, SnCommands } from "~/types/events";
import "./flows/auth";
import "./flows/unit-status";
import "./flows/911-call-attach";
import "./flows/traffic-stop";

const API_URL = GetConvar("snailycad_url", "null");

if (API_URL === "null") {
  console.error(`
  ---------------------------------------

[${GetCurrentResourceName()}] Failed to find the "snailycad_url" convar in your server.cfg. Please make sure you are using \`setr\` and not \`set\`:

\`setr snailycad_url "<api-url-here>/v1" \`

  ---------------------------------------`);
}

emit(
  "chat:addSuggestion",
  `/${SnCommands.PanicButton}`,
  "Toggle the panic button state for your active unit.",
);

/**
 * send a message to the NUI with the API URL when a player spawns.
 */
onNet("playerSpawned", () => {
  SendNuiMessage(JSON.stringify({ action: "sn:initialize", data: { url: API_URL } }));
});

on(
  ClientEvents.CreateNotification,
  (options: { timeout?: number; title: string; message: string }) => {
    SendNuiMessage(
      JSON.stringify({
        action: ClientEvents.CreateNotification,
        data: { ...options, url: API_URL },
      }),
    );
  },
);

/**
 * event: connected
 * simply send a message back to the NUI side to confirm that we are connected.
 */
RegisterNuiCallbackType(NuiEvents.Connected);
on(`__cfx_nui:${NuiEvents.Connected}`, (_data: never, cb: Function) => {
  console.info("Connected to SnailyCAD!");
  cb({ ok: true });
});

/**
 * event: closeNui
 * close the NUI window.
 */
RegisterNuiCallbackType(NuiEvents.CloseNui);
on(`__cfx_nui:${NuiEvents.CloseNui}`, (_data: never, cb: Function) => {
  SetNuiFocus(false, false);
  cb({ ok: true });
});

RegisterNuiCallbackType(NuiEvents.ConnectionError);
on(`__cfx_nui:${NuiEvents.ConnectionError}`, (data: Partial<Error> | null, cb: Function) => {
  console.info(data?.message ?? data?.name ?? (String(data) || "Unknown error"));
  console.info("Unable to connect to SnailyCAD. Error:", data);
  cb({ ok: true });
});
