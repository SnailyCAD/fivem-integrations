import { Socket, io } from "socket.io-client";
import { ClientEvents, NuiEvents } from "./types";
import { createNotification } from "./flows/notification";
import { SocketEvents } from "@snailycad/config";

export interface NuiMessage {
  action: string;
  data?: {
    url: string;
    version?: string;

    /** notification data */
    message?: string;
    title?: string;
    timeout?: number;
  };
}

declare global {
  function GetParentResourceName(): string;
}

window.addEventListener("message", (event: MessageEvent<NuiMessage>) => {
  const apiURL = event.data.data?.url;
  if (!apiURL) {
    return;
  }

  switch (event.data.action) {
    case "sn:initialize": {
      if (event.data.data?.version) {
        console.log(`[sna-sync-nui][incoming]: Version ${event.data.data.version}`);
      }
      onSpawn(apiURL);
      break;
    }
    case ClientEvents.CreateNotification: {
      const title = event.data.data?.title;
      const message = event.data.data?.message;
      const timeout = event.data.data?.timeout;

      if (title && message) {
        createNotification({ timeout, title, message });
      }

      break;
    }
    default: {
      break;
    }
  }
});

let socket: Socket;

function onSpawn(apiURL: string) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  socket ??= io(apiURL.replace("/v1", ""));

  socket.on("connect", () => fetchNUI(NuiEvents.Connected, { socketId: socket.id }));
  socket.on("connect_error", (error) => fetchNUI(NuiEvents.ConnectionError, { error }));
  socket.on(SocketEvents.Create911Call, (call) => fetchNUI(NuiEvents.Create911Call, call));
  socket.on(SocketEvents.PANIC_BUTTON_ON, (unit) => fetchNUI(NuiEvents.PanicButtonOn, unit));

  socket.on(SocketEvents.Signal100, (enabled: boolean) => {
    if (enabled) {
      createNotification({
        message: "Signal 100 is now enabled.",
        title: "Signal 100 Enabled",
      });
    } else {
      createNotification({
        message: "Signal 100 is now disabled.",
        title: "Signal 100 Disabled",
      });
    }
  });
  socket.on(SocketEvents.UpdateAreaOfPlay, (areaOfPlay: string | null) =>
    createNotification({
      message: `Area of play has been updated to: ${areaOfPlay ?? "None"}`,
      title: "AOP Changed",
    }),
  );
}

export async function fetchNUI(eventName: NuiEvents, data = {}) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    } as const;

    const resourceName = GetParentResourceName();
    const url = `https://${resourceName}/${eventName}`;
    const response = await new Promise((resolve, reject) => {
      fetch(url, options)
        .then((value) => resolve(value))
        .catch((reason) => {
          reject(new Error(`Failed to fetch url: ("${url}"), Reason: ${reason}`));
        });
    });

    console.log("[`sna-sync-nui`][outgoing]:", eventName);

    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
}
