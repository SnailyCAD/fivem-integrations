import * as React from "react";

export interface NuiMessage<T = any> {
  action: string;
  data?: { url: string; userApiToken: string | null } & T;
}

export function useNuiEvent<T>(action: string, onEvent: (data: NuiMessage<T>["data"]) => void) {
  function messageListener(event: MessageEvent<NuiMessage<T>>) {
    console.log("[`sna-sync-nui`][incoming]:", action);
    if (event.data.action.toLocaleLowerCase() === action.toLocaleLowerCase()) {
      onEvent(event.data.data);
    }
  }

  React.useEffect(() => {
    window.addEventListener("message", messageListener);
    return () => window.removeEventListener("message", messageListener);
  }, []);
}
