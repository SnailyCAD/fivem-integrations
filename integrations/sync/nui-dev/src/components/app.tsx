import { AuthenticationScreen } from "../screens/authentication-screen";
import { ClientEvents } from "../types";
import { NextIntlWrapper } from "./next-intl";
import { VisibilityProvider } from "./visibility-provider";

export function App() {
  return (
    <NextIntlWrapper>
      <VisibilityProvider action={ClientEvents.RequestAuthFlow}>
        <AuthenticationScreen />
      </VisibilityProvider>
    </NextIntlWrapper>
  );
}
