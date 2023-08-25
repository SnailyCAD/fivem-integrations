import * as React from "react";
import { ClientEvents } from "../types";
import { NextIntlWrapper } from "./next-intl";
import { VisibilityProvider } from "./visibility-provider";

const AuthenticationScreen = React.lazy(async () => ({
  default: (await import("../screens/authentication-screen")).AuthenticationScreen,
}));

export function App() {
  return (
    <NextIntlWrapper>
      <VisibilityProvider action={ClientEvents.RequestAuthFlow}>
        <AuthenticationScreen />
      </VisibilityProvider>
    </NextIntlWrapper>
  );
}
