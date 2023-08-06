import { Socket, io } from "socket.io-client";
import { handleAuthenticationFlow } from "./authentication";

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
  const apiURL = event.data.data?.url;

  if (!apiURL) {
    return;
  }

  switch (event.data.action) {
    case "sn:initialize": {
      onSpawn(apiURL);

      break;
    }
    case "sna-sync:request-authentication-flow": {
      const authenticationFlowElement = document.getElementById("authentication-flow");
      if (authenticationFlowElement) {
        authenticationFlowElement.classList.remove("hidden");

        handleAuthenticationFlow(apiURL);
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

export async function fetchNUI(eventName: string, data = {}) {
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
    return null;
  }
}
