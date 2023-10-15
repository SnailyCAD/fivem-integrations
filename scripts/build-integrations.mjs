import "dotenv/config";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as esbuild from "esbuild";

const FXSERVER_RESOURCES_PATH = process.env.FXSERVER_RESOURCES_PATH;

const BASE_SOURCE_PATH = path.resolve(process.cwd(), "integrations");
const INTEGRATIONS_SOURCE = await fs.readdir(BASE_SOURCE_PATH);
const PREFIX = "sna";

for (const integrationKey of INTEGRATIONS_SOURCE) {
  const integrationPath = path.resolve(BASE_SOURCE_PATH, integrationKey);
  const isPostals = integrationKey === "postals";
  const isSync = integrationKey === "sync";

  const distDir = FXSERVER_RESOURCES_PATH
    ? `${FXSERVER_RESOURCES_PATH}/${PREFIX}-${integrationKey}`
    : `dist/${PREFIX}-${integrationKey}`;

  console.log(`Building ${integrationKey} to ${distDir}`);

  if (isSync) {
    const nuiFolder = path.resolve(integrationPath, "nui");

    await fs.mkdir(distDir).catch(() => null);
    fs.cp(path.resolve(nuiFolder), path.resolve(distDir, "nui/"), { recursive: true });
  }

  if (isPostals) {
    const postalsFile = isPostals && path.resolve(integrationPath, "postals.json");
    const postalsJson = await fs.readFile(postalsFile, "utf-8");

    await fs.mkdir(distDir).catch(() => null);
    await fs.writeFile(path.resolve(distDir, "postals.json"), postalsJson);
  }

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

  const fxmanifest = path.resolve(integrationPath, "fxmanifest.lua");
  const manifest = await fs.readFile(fxmanifest);

  fs.writeFile(path.resolve(distDir, "fxmanifest.lua"), manifest);

  const documentationUrl = path.resolve(integrationPath, "documentation.url");
  const documentationUrlContents = await fs.readFile(documentationUrl).catch(() => null);

  if (documentationUrlContents) {
    fs.writeFile(path.resolve(distDir, "documentation.url"), documentationUrlContents);
  }
}
