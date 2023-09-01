import { cadRequest } from "./fetch.server";
import { request } from "undici";

on("onResourceStart", async (resourceName: string) => {
  if (GetCurrentResourceName() !== resourceName) {
    return;
  }

  await verifyCADApiVersion();
  await verifyCurrentVersion();
});

async function verifyCurrentVersion() {
  // @ts-expect-error index is not required
  const currentResourceVersion = GetResourceMetadata(GetCurrentResourceName(), "version");

  console.log(`Checking for updates...
Current Version: ${currentResourceVersion}`);

  try {
    const PACKAGE_JSON_URL =
      "https://raw.githubusercontent.com/SnailyCAD/fivem-integrations/main/package.json";

    const data = (await request(PACKAGE_JSON_URL).then((res) => res.body.json())) as {
      version: string;
    };

    if (data.version !== currentResourceVersion) {
      console.log(`
---------------------------------------

[${GetCurrentResourceName()}] A new version is available: ${data.version}.
Please find the latest version at: https://github.com/SnailyCAD/fivem-integrations/releases

---------------------------------------`);
    }
  } catch (err) {
    // ignore
  }
}

async function verifyCADApiVersion() {
  try {
    const { data } = await cadRequest({
      path: "/",
      method: "GET",
      responseType: "text",
    });

    if (!data?.includes("200 Success. Current CAD Version")) {
      console.warn(`
---------------------------------------

[${GetCurrentResourceName()}] Failed to verify SnailyCAD version. Please make sure the following:

- Correct global API Token set in server.cfg as "snailycad_api_key"
- Correct SnailyCAD URL set in server.cfg as "snailycad_url"
- Your SnailyCAD instance API is running and is accessible from this server

---------------------------------------`);
    }
  } catch (err) {
    console.error(err);

    console.warn(`
---------------------------------------

    [${GetCurrentResourceName()}] Failed to verify SnailyCAD version. Please make sure the following:

    - Correct global API Token set in server.cfg as "snailycad_api_key"
    - Correct SnailyCAD URL set in server.cfg as "snailycad_url"
    - Your SnailyCAD instance API is running and is accessible from this server

---------------------------------------`);
  }
}
