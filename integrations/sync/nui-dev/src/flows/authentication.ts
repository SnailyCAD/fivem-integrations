import { fetchNUI } from "../main";
import { NuiEvents } from "../types";

async function closeAuthenticationFlow() {
  const authenticationFlowElement = document.getElementById("authentication-flow");
  await fetchNUI(NuiEvents.CloseAuthenticationFlow, {});

  if (authenticationFlowElement) {
    authenticationFlowElement.classList.add("hidden");
  }
}

export async function handleAuthenticationFlow(source: number) {
  const closeAuthenticationFlowButton = document.getElementById("close-authentication-flow");
  if (closeAuthenticationFlowButton) {
    closeAuthenticationFlowButton.addEventListener("click", async () => {
      closeAuthenticationFlow();
    });
  }

  const authenticationFlowForm = document.getElementById("authentication-flow-form");
  if (authenticationFlowForm) {
    authenticationFlowForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const elements = (event.currentTarget as HTMLFormElement).elements;
      const tokenElement = elements.namedItem("api_token") as HTMLInputElement | null;
      if (!tokenElement) return;

      closeAuthenticationFlow();
      fetchNUI(NuiEvents.OnVerifyUserAPITokenRequest, {
        token: tokenElement.value,
        source,
      });
    });
  }
}
