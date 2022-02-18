import { Octokit } from "@octokit/action";
import * as fs from "node:fs/promises";
import { resolve } from "node:path";

const packageJson = JSON.parse(
  await fs.readFile(new URL("../package.json", import.meta.url), { encoding: "utf8" }),
);
const octokit = new Octokit();
const [OWNER, REPOSITORY] = process.env.GITHUB_REPOSITORY.split("/");

console.log("👀 Getting the previous release version");
const previousReleases = await octokit.repos.listReleases({
  owner: OWNER,
  repo: REPOSITORY,
});

const previousRelease = previousReleases.data.find((release) => !release.draft);
console.log("👀 Previous release version:", previousRelease?.tag_name);

const releaseChangelog = [];
const changelogContent = await fs.readFile(new URL("../CHANGELOG.md", import.meta.url), {
  encoding: "utf8",
});

if (previousRelease) {
  // find difference between previous release and current version
  const maybeMinorIndex = changelogContent.indexOf(`## ${previousRelease.tag_name}`);

  releaseChangelog.push(changelogContent.slice(0, maybeMinorIndex));
} else {
  releaseChangelog.push(changelogContent);
}

const { data } = await octokit.repos.generateReleaseNotes({
  owner: OWNER,
  repo: REPOSITORY,
  tag_name: packageJson.version,
});

releaseChangelog.push("", data.body.slice(data.body.indexOf("**Full Changelog**")));

console.log(`🎉 Creating new release with version ${packageJson.version}`);

const release = await octokit.repos.createRelease({
  owner: OWNER,
  repo: REPOSITORY,
  tag_name: packageJson.version,
  name: packageJson.version,
  body: releaseChangelog.join("\n"),
});

const BASE_PATH = resolve(process.cwd(), "dist");
const INTEGRATIONS = (await fs.readdir(BASE_PATH)).filter((v) => v.endsWith(".zip"));

for (const integrationZip of INTEGRATIONS) {
  const zipFilePath = resolve(BASE_PATH, integrationZip);

  const stat = await fs.stat(zipFilePath);
  if (!stat.isFile()) {
    console.log(`Skipping ${zipFilePath}, since its not a file`);
  }

  const fileSize = stat.size;
  const fileBytes = await fs.readFile(zipFilePath);

  await octokit.repos.uploadReleaseAsset({
    release_id: release.data.id,
    name: integrationZip,
    owner: OWNER,
    repo: REPOSITORY,
    data: fileBytes,
    headers: {
      "content-type": "binary/octet-stream",
      "content-length": fileSize,
    },
  });

  console.log(`Uploaded asset ${integrationZip}, to release tag ${release.data.tag_name}`);
}
