import React from "react";
import { useVisibility } from "../components/visibility-provider";
import { fetchNUI } from "../main";
import { NuiEvents } from "../types";

export function AuthenticationScreen() {
  const { hide } = useVisibility();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const elements = event.currentTarget.elements;
    const tokenElement = elements.namedItem("api_token") as HTMLInputElement | null;
    if (!tokenElement) return;

    console.log("Submitting authentication flow", tokenElement.value);
  }

  function onClose() {
    hide();
    fetchNUI(NuiEvents.CloseAuthenticationFlow);
  }

  return (
    <div className="w-[48em] rounded-md bg-primary p-8">
      <header className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-white">
            SnailyCAD Personal API Token Authentication
          </h1>

          <button
            onClick={onClose}
            className="bg-secondary border-quinary cursor-pointer rounded-md border p-1.5 text-white transition-colors hover:brightness-150 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        </div>

        <p>
          Use your Personal API Token found at your CAD URL {"->"} Account {"->"} API Token. <br />
          This will allow you to interact with the CAD from within FiveM.
        </p>
      </header>

      <form onSubmit={onSubmit} id="authentication-flow-form" className="mt-3">
        <label htmlFor="api_token" className="mb-2">
          Personal API Token
        </label>
        <input
          name="api_token"
          id="api_token"
          type="password"
          className="bg-secondary border-quinary w-full rounded-md border p-1.5 px-3 text-white outline-none transition-colors focus:border-gray-500 disabled:cursor-not-allowed disabled:opacity-80"
        />

        <button className="bg-secondary border-quinary mt-2 cursor-pointer rounded-md border p-1 px-4 text-white transition-colors hover:brightness-150 disabled:cursor-not-allowed disabled:opacity-60">
          Authenticate
        </button>
      </form>
    </div>
  );
}
