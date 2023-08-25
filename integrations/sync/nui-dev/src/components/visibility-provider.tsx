import * as React from "react";
import { cn } from "mxcn";
import { useNuiEvent } from "../hooks/use-nui-event";

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

  React.useEffect(() => {
    function keyboardHandler(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setVisible(false);
        // todo: streamlined event for closing flows
        // in other words, 1 single event to close all flows
      }
    }

    window.addEventListener("keydown", keyboardHandler);
    return () => {
      window.removeEventListener("keydown", keyboardHandler);
    };
  }, []);

  return (
    <visibilityContext.Provider value={{ data, hide: () => setVisible(false), visible }}>
      <div className={cn(visible ? "visible" : "hidden")}>{props.children}</div>
    </visibilityContext.Provider>
  );
}

export function useVisibility<T>(): VisibilityContext<T> {
  const context = React.useContext(visibilityContext);
  if (context === undefined) {
    throw new Error("useVisibility must be used within a VisibilityProvider");
  }
  return context;
}
