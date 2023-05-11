/**
 * send a message to the NUI with the API URL when a player spawns.
 */
onNet("playerSpawned", (player: unknown) => {
  console.log(player);

  const url = GetConvar("snailycad_url", "null");
  SendNuiMessage(JSON.stringify({ action: "sn:initialize", data: { url } }));
});

/**
 * event: connected
 * simply send a message back to the NUI side to confirm that we are connected.
 */
RegisterNuiCallbackType("connected"); // register the type

on("__cfx_nui:connected", (_data: never, cb: Function) => {
  console.info("Connected to SnailyCAD!");
  cb({ ok: true });
});

/**
 * event: Signal 100 toggled
 * listen for the `fetch` event from the NUI side. When there are changes to the signal 100,
 * we will send a message to the chat.
 */
RegisterNuiCallbackType("Signal100");

on("__cfx_nui:Signal100", (data: { enabled: boolean }, cb: Function) => {
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
RegisterNuiCallbackType("UpdateAreaOfPlay");

on("__cfx_nui:UpdateAreaOfPlay", (data: { areaOfPlay: string | null }, cb: Function) => {
  const formattedDate = formatDate(new Date());

  if (data.areaOfPlay) {
    emit("chat:addMessage", {
      color: [255, 0, 0],
      args: ["SnailyCAD", `^5${formattedDate} ^7- Area of play changed: ^*${data.areaOfPlay}`],
    });
  }

  cb({ ok: true });
});

function formatDate(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}
