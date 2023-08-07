import { handleClientCadRequest } from "./fetch.client";
import { fetchNUI } from "./main";

export async function handleAuthenticationFlow(apiUrl: string) {
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

      const response = await handleClientCadRequest(apiUrl, "/auth/login", "POST", {
        test: "hello world",
      });

      const text = await response.text();
      console.log(response);
      console.log(text);

      fetchNUI("sna-sync:authentication-flow-success", { id: "test" });

      // todo: onSuccessful login -> send event to client
    });
  }
}
