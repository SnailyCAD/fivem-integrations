import * as React from "react";
import { cn } from "mxcn";
import { useNuiEvent } from "../hooks/use-nui-event";

interface Props {
  children: React.ReactNode;
  action: string;
}

interface VisibilityContext {
  visible: boolean;
  hide(): void;
}

const visibilityContext = React.createContext<VisibilityContext | undefined>(undefined);

export function VisibilityProvider(props: Props) {
  const [visible, setVisible] = React.useState(false);

  useNuiEvent(props.action, () => {
    setVisible(true);
  });

  React.useEffect(() => {
    function keyboardHandler(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setVisible(false);
      }
    }

    window.addEventListener("keydown", keyboardHandler);
    return () => {
      window.removeEventListener("keydown", keyboardHandler);
    };
  }, []);

  return (
    <visibilityContext.Provider value={{ hide: () => setVisible(false), visible }}>
      <div className={cn(visible ? "visible" : "hidden")}>{props.children}</div>
    </visibilityContext.Provider>
  );
}

export function useVisibility() {
  const context = React.useContext(visibilityContext);
  if (context === undefined) {
    throw new Error("useVisibility must be used within a VisibilityProvider");
  }
  return context;
}
