import { Socket, io } from "socket.io-client";

interface NuiMessage {
  action: string;
  data?: { url: string };
}

declare global {
  interface Window {
    GetCurrentResourceName?(): string;
  }
}

window.addEventListener("message", (event: MessageEvent<NuiMessage>) => {
  switch (event.data.action) {
    case "sn:initialize": {
      const apiURL = event.data.data?.url;
      if (apiURL) {
        onSpawn(apiURL);
      }

      break;
    }
    case "sna-sync:request-authentication-flow": {
      // todo: show form to handle user auth input
      // todo: onSuccessful login -> send event to client

      break;
    }
    default: {
      break;
    }
  }
});

let socket: Socket;

function onSpawn(apiURL: string) {
  socket = io(apiURL.replace("/v1", ""));

  socket.on("connect", () => fetchNUI("connected", { socketId: socket.id }));
  socket.on("connect_error", (error) => fetchNUI("connect_error", { error }));

  socket.on("Signal100", (enabled) =>
    fetchNUI("Signal100", {
      enabled,
    }),
  );

  socket.on("UpdateAreaOfPlay", (areaOfPlay: string | null) =>
    fetchNUI("UpdateAreaOfPlay", {
      areaOfPlay,
    }),
  );
}

async function fetchNUI(eventName: string, data = {}) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    } as const;

    const resourceName = window.GetCurrentResourceName?.() ?? "sna-sync";
    const response = await fetch(`https://${resourceName}/${eventName}`, options);

    return response;
  } catch (err) {
    console.error(err);
  }
}
