import { AuthenticationScreen } from "../screens/authentication-screen";
import { ClientEvents } from "../types";
import { VisibilityProvider } from "./visibility-provider";

export function App() {
  return (
    <>
      <VisibilityProvider action={ClientEvents.RequestAuthFlow}>
        <AuthenticationScreen />
      </VisibilityProvider>
    </>
  );
}
