import * as React from "react";
import { ClientEvents } from "../types";
import { NextIntlWrapper } from "./next-intl";
import { VisibilityProvider } from "./visibility-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AuthenticationScreen = React.lazy(async () => ({
  default: (await import("../screens/authentication-screen")).AuthenticationScreen,
}));

const SetStatusScreen = React.lazy(async () => ({
  default: (await import("../screens/set-status-screen")).SetStatusScreen,
}));

const Call911AttachScreen = React.lazy(async () => ({
  default: (await import("../screens/call-911-attach-screen")).Call911AttachScreen,
}));

const RegisterVehicleScreen = React.lazy(async () => ({
  default: (await import("../screens/register-vehicle-screen")).RegisterVehicleScreen,
}));

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
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

        <VisibilityProvider action={ClientEvents.RequestRegisterVehicleFlow}>
          <RegisterVehicleScreen />
        </VisibilityProvider>
      </NextIntlWrapper>
    </QueryClientProvider>
  );
}
