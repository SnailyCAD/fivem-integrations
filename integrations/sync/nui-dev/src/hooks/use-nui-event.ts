import * as React from "react";

export interface NuiMessage<T = any> {
  action: string;
  data?: T;
}

export function useNuiEvent<T>(action: string, onEvent: (data: NuiMessage<T>["data"]) => void) {
  function messageListener(event: MessageEvent<NuiMessage<T>>) {
    console.log(JSON.stringify(event.data));
    if (event.data.action.toLocaleLowerCase() === action.toLocaleLowerCase()) {
      onEvent(event.data.data);
    }
  }

  React.useEffect(() => {
    window.addEventListener("message", messageListener);
    return () => window.removeEventListener("message", messageListener);
  }, []);
}
