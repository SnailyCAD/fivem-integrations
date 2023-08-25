import * as React from "react";
import { ClientEvents } from "../types";
import { NextIntlWrapper } from "./next-intl";
import { VisibilityProvider } from "./visibility-provider";

const AuthenticationScreen = React.lazy(async () => ({
  default: (await import("../screens/authentication-screen")).AuthenticationScreen,
}));

const SetStatusScreen = React.lazy(async () => ({
  default: (await import("../screens/set-status-screen")).SetStatusScreen,
}));

const Call911AttachScreen = React.lazy(async () => ({
  default: (await import("../screens/call-911-attach-screen")).Call911AttachScreen,
}));

export function App() {
  return (
    <NextIntlWrapper>
      <VisibilityProvider action={ClientEvents.RequestAuthFlow}>
        <AuthenticationScreen />
      </VisibilityProvider>

      <VisibilityProvider action={ClientEvents.RequestSetStatusFlow}>
        <SetStatusScreen />
      </VisibilityProvider>

      <VisibilityProvider action={ClientEvents.RequestCall911AttachFlow}>
        <Call911AttachScreen />
      </VisibilityProvider>
    </NextIntlWrapper>
  );
}
