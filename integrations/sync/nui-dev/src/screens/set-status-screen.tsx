import * as React from "react";
import { SelectField, Button } from "@snailycad/ui";
import { useVisibility } from "../components/visibility-provider";
import { fetchNUI } from "../main";
import { NuiEvents } from "../types";
import { StatusValue } from "@snailycad/types";

export function SetStatusScreen() {
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);

  const { hide, data } = useVisibility<{
    statusCodes?: StatusValue[];
    unitId?: string;
    source?: number;
  }>();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedKey) return;

    hide();

    // todo: add loading state + error state in UI instead of chat.
    // instead of sending API requests via the server, we should
    // send the API requests here. If an error occurs, we should
    // show the error message in the UI.
    // use react-query for this.
    fetchNUI(NuiEvents.OnSetUnitStatus, {
      ...data,
      statusCodeId: selectedKey,
    });
  }

  return (
    <div id="set-status-flow" className="max-w-lg rounded-md bg-primary p-8">
      <header className="mb-2">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Set Status</h1>

          <Button className="px-1 text-base" onPress={hide}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </Button>
        </div>

        <p className="text-neutral-200">Set the status for your active unit.</p>
      </header>

      <form onSubmit={onSubmit} className="mt-3">
        <SelectField
          selectedKey={selectedKey}
          onSelectionChange={(key) => setSelectedKey(key as string)}
          label="Status"
          options={(data?.statusCodes ?? []).map((v) => ({
            label: v.value.value,
            value: v.id,
          }))}
        />

        <p className="text-neutral-200 mt-2">
          Additionally use
          <code className="inline-block bg-secondary p-0.5">
            /sn-set-status &lt;status-code&gt;
          </code>
        </p>

        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
