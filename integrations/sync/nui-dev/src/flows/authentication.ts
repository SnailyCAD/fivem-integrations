import { fetchNUI } from "../main";
import { NuiEvents } from "../types";

export async function handleAuthenticationFlow(source: number) {
  const closeAuthenticationFlowButton = document.getElementById("close-authentication-flow");
  if (closeAuthenticationFlowButton) {
    closeAuthenticationFlowButton.addEventListener("click", async () => {
      const authenticationFlowElement = document.getElementById("authentication-flow");
      await fetchNUI(NuiEvents.CloseAuthenticationFlow, {});

      if (authenticationFlowElement) {
        authenticationFlowElement.classList.add("hidden");
      }
    });
  }

  const authenticationFlowForm = document.getElementById("authentication-flow-form");
  if (authenticationFlowForm) {
    authenticationFlowForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const elements = (event.currentTarget as HTMLFormElement).elements;
      const tokenElement = elements.namedItem("api_token") as HTMLInputElement | null;
      if (!tokenElement) return;

      fetchNUI(NuiEvents.OnVerifyUserAPITokenRequest, {
        token: tokenElement.value,
        source,
      });
    });
  }
}
