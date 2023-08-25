import * as React from "react";
import { cn } from "mxcn";
import { useNuiEvent } from "../hooks/use-nui-event";
import { fetchNUI } from "../main";
import { NuiEvents } from "../types";

interface Props {
  children: React.ReactNode;
  action: string;
}

interface VisibilityContext<T = any> {
  visible: boolean;
  data?: T;
  hide(): void;
}

const visibilityContext = React.createContext<VisibilityContext | undefined>(undefined);

export function VisibilityProvider(props: Props) {
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = React.useState<unknown>(null);

  useNuiEvent(props.action, (data) => {
    setVisible(true);
    setData(data);
  });

  function hide() {
    setVisible(false);
    fetchNUI(NuiEvents.CloseNui);
  }

  React.useEffect(() => {
    function keyboardHandler(event: KeyboardEvent) {
      if (event.key === "Escape") hide();
    }

    window.addEventListener("keydown", keyboardHandler);
    return () => {
      window.removeEventListener("keydown", keyboardHandler);
    };
  }, []);

  return (
    <visibilityContext.Provider value={{ data, hide, visible }}>
      <div className={cn(visible ? "visible" : "hidden")}>{props.children}</div>
    </visibilityContext.Provider>
  );
}

export function useVisibility<T>(): VisibilityContext<T> {
  const context = React.useContext(visibilityContext);
  if (!context) throw new Error("useVisibility must be used within a VisibilityProvider");
  return context;
}
