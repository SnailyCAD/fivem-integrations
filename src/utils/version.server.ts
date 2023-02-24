import { cadRequest } from "./fetch.server";

on("onResourceStart", async (resourceName: string) => {
  if (GetCurrentResourceName() !== resourceName) {
    return;
  }

  await verifyVersion();
});

async function verifyVersion() {
  try {
    const response = await cadRequest("/", "GET");

    const textResponse = await response?.body.text(); // example response: 200 Success. Current CAD Version: 1.48.1 - bf19df6

    if (!textResponse?.includes("200 Success. Current CAD Version")) {
      console.error("Failed to verify CAD version");
    }
  } catch (err) {
    console.error(err);

    console.warn(`
---------------------------------------
[${GetCurrentResourceName()}] Failed to verify CAD version. Please make sure you have correctly configured the CAD URL and API key in your server.cfg. Read more here: https://docs.snailycad.org/docs/fivem-integrations/scripts
---------------------------------------`);
  }
}
