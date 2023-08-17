import { cadRequest } from "./fetch.server";

on("onResourceStart", async (resourceName: string) => {
  if (GetCurrentResourceName() !== resourceName) {
    return;
  }

  await verifyCADApiVersion();
});

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
[${GetCurrentResourceName()}] Failed to verify SnailyCAD version. Please make sure you have correctly configured the SnailyCAD URL and API key in your server.cfg. Read more here: https://docs.snailycad.org/docs/fivem-integrations/scripts
---------------------------------------`);
    }
  } catch (err) {
    console.error(err);

    console.warn(`
---------------------------------------
[${GetCurrentResourceName()}] Failed to verify SnailyCAD version. Please make sure you have correctly configured the SnailyCAD URL and API key in your server.cfg. Read more here: https://docs.snailycad.org/docs/fivem-integrations/scripts
---------------------------------------`);
  }
}
