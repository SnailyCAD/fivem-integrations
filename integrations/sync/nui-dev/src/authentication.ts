import { handleClientCadRequest } from "./fetch.client";
import { fetchNUI } from "./main";

export async function handleAuthenticationFlow(apiUrl: string, identifiers: string[]) {
  const closeAuthenticationFlowButton = document.getElementById("close-authentication-flow");
  if (closeAuthenticationFlowButton) {
    closeAuthenticationFlowButton.addEventListener("click", async () => {
      const authenticationFlowElement = document.getElementById("authentication-flow");
      await fetchNUI("sna-sync:close-authentication-flow", {});

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

      const response = await handleClientCadRequest(apiUrl, "/user/api-token/validate", "POST", {
        token: tokenElement.value,
        identifiers,
      });

      const json = await response.json(); // basic user data
      const hasErrors = json.name === "BAD_REQUEST" || json.status === 400;
      console.log(JSON.stringify(json, null, 4));

      const errorHintElement = document.getElementById("api_token_hint");
      if (errorHintElement) {
        if (hasErrors) {
          errorHintElement.innerText = json.message;
          errorHintElement.classList.add("text-red-400");
          errorHintElement.classList.remove("hidden", "text-green-400");
          return;
        }

        errorHintElement.classList.remove("hidden", "text-red-400");
        errorHintElement.classList.add("text-green-400");
        errorHintElement.innerText = "Successfully authenticated. You can now close this window.";
      }

      if (!hasErrors) {
        fetchNUI("sna-sync:authentication-flow-success", json);
      }
    });
  }
}
