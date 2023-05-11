import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

declare global {
  interface Window {
    GetCurrentResourceName?(): string;
  }
}

socket.on("connect", () => fetchNUI("connected", { socketId: socket.id }));

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
