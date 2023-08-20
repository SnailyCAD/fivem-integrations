const API_URL = GetConvar("snailycad_url", "null");

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

/**
 * event: connected
 * simply send a message back to the NUI side to confirm that we are connected.
 */
RegisterNuiCallbackType(NuiEvents.Connected);
on(`__cfx_nui:${NuiEvents.Connected}`, (_data: never, cb: Function) => {
  console.info("Connected to SnailyCAD!");
  cb({ ok: true });
});

RegisterNuiCallbackType(NuiEvents.ConnectionError);
on(`__cfx_nui:${NuiEvents.ConnectionError}`, (data: Partial<Error> | null, cb: Function) => {
  console.info(data?.message ?? data?.name ?? (String(data) || "Unknown error"));
  console.info("Unable to connect to SnailyCAD. Error:", data);
  cb({ ok: true });
});

/**
 * event: Signal 100 toggled
 * listen for the `fetch` event from the NUI side. When there are changes to the signal 100,
 * we will send a message to the chat.
 */
RegisterNuiCallbackType(NuiEvents.Signal100);
on(`__cfx_nui:${NuiEvents.Signal100}`, (data: { enabled: boolean }, cb: Function) => {
  const formattedDate = formatDate(new Date());

  emit("chat:addMessage", {
    color: [255, 0, 0],
    args: [
      "SnailyCAD",
      `^5${formattedDate} ^7- Signal 100 is now ^*${data.enabled ? "enabled" : "disabled"}`,
    ],
  });

  cb({ ok: true });
});

/**
 * event: AOP changed
 * listen for the `fetch` event from the NUI side. When there are changes to the signal 100,
 * we will send a message to the chat.
 */
RegisterNuiCallbackType(NuiEvents.UpdateAreaOfPlay);
on(
  `__cfx_nui:${NuiEvents.UpdateAreaOfPlay}`,
  (data: { areaOfPlay: string | null }, cb: Function) => {
    const formattedDate = formatDate(new Date());

    if (data.areaOfPlay) {
      emit("chat:addMessage", {
        color: [255, 0, 0],
        args: ["SnailyCAD", `^5${formattedDate} ^7- Area of play changed: ^*${data.areaOfPlay}`],
      });
    }

    cb({ ok: true });
  },
);

function formatDate(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}

import { NuiEvents, SnCommands } from "~/types/events";
import "./flows/auth";
import "./flows/unit-status";
import "./flows/911-call-attach";
import "./flows/traffic-stop";
