import { Socket, io } from "socket.io-client";
import { ClientEvents, NuiEvents } from "./types";
import { handleCall911AttachFlow } from "./flows/911-call-attach";
import { createNotification } from "./flows/notification";
import { AssignedUnit, Call911, StatusValue } from "@snailycad/types";
import { SocketEvents } from "@snailycad/config";

export interface NuiMessage {
  action: string;
  data?: {
    url: string;
    identifiers?: string[];
    statusCodes?: StatusValue[];
    unitId?: string;
    source?: number;
    calls?: (Call911 & { assignedUnits?: AssignedUnit[] })[];
    message?: string;
    title?: string;
    timeout?: number;
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
    case ClientEvents.CreateNotification: {
      const title = event.data.data?.title;
      const message = event.data.data?.message;
      const timeout = event.data.data?.timeout;

      if (title && message) {
        createNotification({ timeout, title, message });
      }

      break;
    }
    // case ClientEvents.RequestAuthFlow: {
    //   const identifiers = event.data.data?.identifiers;

    //   const authenticationFlowElement = document.getElementById("authentication-flow");
    //   if (authenticationFlowElement && identifiers) {
    //     authenticationFlowElement.classList.remove("hidden");
    //     handleAuthenticationFlow(apiURL, identifiers);
    //   }
    //   break;
    // }
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
  socket.on(SocketEvents.PANIC_BUTTON_ON, (unit: { formattedUnitData: string }) => {
    createNotification({
      message: `${unit.formattedUnitData} has pressed their panic button.`,
      title: "Panic Button Enabled",
    });
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
