import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as esbuild from "esbuild";

const BASE_PATH = path.resolve(process.cwd(), "integrations");
const INTEGRATIONS = await fs.readdir(BASE_PATH);
const PREFIX = "sna";

for (const integrationKey of INTEGRATIONS) {
  const integrationPath = path.resolve(BASE_PATH, integrationKey);
  const isPostals = integrationKey === "postals";
  const distDir = `dist/${PREFIX}-${integrationKey}`;

  if (isPostals) {
    const postalsFile = isPostals && path.resolve(integrationPath, "postals.json");
    const postalsJson = await fs.readFile(postalsFile, "utf-8");

    await fs.mkdir(distDir).catch(() => null);
    await fs.writeFile(path.resolve(distDir, "postals.json"), postalsJson);
  } else {
    const serverEntry = path.resolve(integrationPath, "server", "server.ts");
    const clientEntry = path.resolve(integrationPath, "client", "client.ts");

    await esbuild.build({
      bundle: true,
      logLevel: "info",
      entryPoints: [serverEntry, clientEntry],
      format: "cjs",
      outdir: distDir,
      platform: "node",
      target: "node14",
    });
  }

  const fxmanifest = path.resolve(integrationPath, "fxmanifest.lua");
  const manifest = await fs.readFile(fxmanifest);

  fs.writeFile(path.resolve(distDir, "fxmanifest.lua"), manifest);
}
