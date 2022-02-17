import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as esbuild from "esbuild";

const BASE_PATH = path.resolve(process.cwd(), "integrations");
const INTEGRATIONS = await fs.readdir(BASE_PATH);

for (const integrationKey of INTEGRATIONS) {
  const integrationPath = path.resolve(BASE_PATH, integrationKey);
  const serverEntry = path.resolve(integrationPath, "server", "server.ts");
  const clientEntry = path.resolve(integrationPath, "client", "client.ts");
  const distDir = `dist/${integrationKey}`;

  await esbuild.build({
    bundle: true,
    logLevel: "info",
    entryPoints: [serverEntry, clientEntry],
    format: "cjs",
    outdir: distDir,
    platform: "node",
    target: "node14",
  });

  const fxmanifest = path.resolve(integrationPath, "fxmanifest.lua");
  const manifest = await fs.readFile(fxmanifest);

  fs.writeFile(path.resolve(distDir, "fxmanifest.lua"), manifest);
}
