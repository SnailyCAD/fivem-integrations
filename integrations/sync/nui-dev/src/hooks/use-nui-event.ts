import * as React from "react";

export interface NuiMessage<T = unknown> {
  action: string;
  data?: { url: string; userApiToken: string | null } & T;
}

export function useNuiEvent<T>(action: string, onEvent: (data: NuiMessage<T>["data"]) => void) {
  function messageListener(event: MessageEvent<NuiMessage<T>>) {
    if (event.data.action.toLocaleLowerCase() === action.toLocaleLowerCase()) {
      console.log("[`sna-sync-nui`][incoming]:", action);
      onEvent(event.data.data);
    }
  }

  React.useEffect(() => {
    window.addEventListener("message", messageListener);
    return () => window.removeEventListener("message", messageListener);
  }, []);
}
