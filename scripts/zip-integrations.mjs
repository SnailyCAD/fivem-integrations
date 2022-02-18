import * as fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import * as path from "node:path";
import archiver from "archiver";

const BASE_PATH = path.resolve(process.cwd(), "dist");
const INTEGRATIONS = (await fs.readdir(BASE_PATH)).filter((v) => !v.endsWith(".zip"));

for (const integrationKey of INTEGRATIONS) {
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  const distDir = `dist/${integrationKey}`;

  const output = createWriteStream(`${distDir}.zip`);
  archive.pipe(output);
  archive.directory(distDir, false).finalize();
}
