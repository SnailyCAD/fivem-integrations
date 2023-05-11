import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

declare global {
  interface Window {
    GetCurrentResourceName?(): string;
  }
}

socket.on("Signal100", (enabled) => {
  console.log("Signal100", enabled);
  fetchNUI("Signal100", {
    enabled,
  });
});

socket.on("connect", () => {
  console.log("connected");

  fetchNUI("connected", {
    socketId: socket.id,
  });
});

async function fetchNUI(eventName: string, data = {}) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  };

  const resourceName = window.GetCurrentResourceName?.() ?? "sna-sync";
  console.log(resourceName);

  const response = await fetch(`https://${resourceName}/${eventName}`, options).catch((err) => {
    console.log(err.message);
    console.error(err.toString?.());
  });
  return response;
}
