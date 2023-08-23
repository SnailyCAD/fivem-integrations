import { Socket, io } from "socket.io-client";
import { handleAuthenticationFlow } from "./flows/authentication";
import { handleSetStatusFlow } from "./flows/set-status";
import { ClientEvents, NuiEvents } from "./types";
import { handleCall911AttachFlow } from "./flows/911-call-attach";
import { createNotification } from "./flows/notification";

export interface NuiMessage {
  action: string;
  data?: {
    url: string;
    identifiers?: string[];
    statusCodes?: any[];
    unitId?: string;
    source?: number;
    calls?: any[];
  };
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
    case ClientEvents.RequestAuthFlow: {
      const identifiers = event.data.data?.identifiers;

      const authenticationFlowElement = document.getElementById("authentication-flow");
      if (authenticationFlowElement && identifiers) {
        authenticationFlowElement.classList.remove("hidden");
        handleAuthenticationFlow(apiURL, identifiers);
      }
      break;
    }
    case ClientEvents.RequestSetStatusFlow: {
      const setStatusFlowElement = document.getElementById("set-status-flow");
      const statusCodes = event.data.data?.statusCodes ?? [];
      const unitId = event.data.data?.unitId;
      const source = event.data.data?.source;

      if (setStatusFlowElement && unitId && source) {
        setStatusFlowElement.classList.remove("hidden");
        handleSetStatusFlow({ statusCodes, source, unitId });
      }

      break;
    }
    case ClientEvents.RequestCall911AttachFlow: {
      const call911AttachFlowElement = document.getElementById("call-911-attach-flow");
      const unitId = event.data.data?.unitId;
      const source = event.data.data?.source;
      const calls = event.data.data?.calls ?? [];

      if (call911AttachFlowElement && unitId && source) {
        call911AttachFlowElement.classList.remove("hidden");
        handleCall911AttachFlow({ calls, source, unitId });
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

  socket.on("connect", () => fetchNUI(NuiEvents.Connected, { socketId: socket.id }));
  socket.on("connect_error", (error) => fetchNUI(NuiEvents.ConnectionError, { error }));

  socket.on("Signal100", (enabled) => {
    if (enabled) {
      createNotification({
        timestamp: Date.now(),
        message: "Signal 100 is now enabled.",
        title: "Signal 100 Enabled",
      });
    } else {
      createNotification({
        timestamp: Date.now(),
        message: "Signal 100 is now disabled.",
        title: "Signal 100 Disabled",
      });
    }
  });
  socket.on("UpdateAreaOfPlay", (areaOfPlay: string | null) =>
    createNotification({
      timestamp: Date.now(),
      message: `Area of play has been updated to: ${areaOfPlay ?? "None"}`,
      title: "AOP Changed",
    }),
  );
  socket.on("PanicButton", () => {
    // todo
  });
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

    const resourceName = window.GetCurrentResourceName?.() ?? "sna-sync";
    const response = await fetch(`https://${resourceName}/${eventName}`, options);

    return response;
  } catch (err) {
    console.error(err);
    return null;
  }
}
