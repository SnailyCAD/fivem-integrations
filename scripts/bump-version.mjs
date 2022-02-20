import * as fs from "node:fs/promises";
import * as path from "node:path";

const BASE_PATH = path.resolve(process.cwd(), "integrations");
const INTEGRATIONS = await fs.readdir(BASE_PATH);

const [, , version] = process.argv;
const FX_VERSION_REGEX = /version "[0-9].[0-9].[0-9]"/;

if (!version) {
  throw new Error("Must specify a new version.");
}

for (const integrationKey of INTEGRATIONS) {
  const fxmanifestPath = path.resolve(BASE_PATH, integrationKey, "fxmanifest.lua");
  const fxmanifest = await fs.readFile(fxmanifestPath, "utf8");

  const updated = fxmanifest.replace(FX_VERSION_REGEX, `version "${version}"`);

  await fs.writeFile(fxmanifestPath, updated);

  console.log(`Updated version to ${version} in ${integrationKey}\n`);
}

const pkgJsonPath = path.resolve(process.cwd(), "package.json");
const pkg = await fs.readFile(pkgJsonPath, "utf-8");
const json = JSON.parse(pkg);

json.version = version;

await fs.writeFile(pkgJsonPath, JSON.stringify(json, null, 2));

console.log(`Updated version to ${version} in package.json`);
