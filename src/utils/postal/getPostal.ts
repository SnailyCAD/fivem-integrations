/**
 * script originally created by nick-perry14 on GitHub in LUA
 *
 * - https://github.com/nick-perry14
 */

import { resolve } from "node:path";
import defaultPostals from "./postals.json";

export async function getPostal(playerPosition: {
  x: number;
  y: number;
  z: number;
}): Promise<string | null> {
  let ndm = -1; // nearest distance magnitude
  let ni = -1; // nearest index

  const postals = await getPostalCodes();

  postals.map((postal, idx) => {
    // prettier-ignore
    const dm = (playerPosition.x - postal.x) ^2 + (playerPosition.y - postal.y) ^2 // distance magnitude

    if (ndm === -1 || dm < ndm) {
      ni = idx;
      ndm = dm;
    }
  });

  let nearest: any = {};
  if (ni !== -1) {
    const nd = Math.sqrt(ndm);
    nearest = { i: ni, d: nd };
  }

  return postals[nearest.i]?.code ?? null;
}

async function getPostalCodes() {
  try {
    const resourceName = GetCurrentResourceName();
    const pwd = resolve(process.cwd(), "resources", resourceName, "postals.json");

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(pwd) as Promise<typeof defaultPostals>;
  } catch (error) {
    if (error instanceof Error) {
      const errorMessage = error.message;

      // return default postals if a custom postals file cannot be found
      if (errorMessage.includes("Cannot find module")) return defaultPostals;
    }

    console.error(error);
    return defaultPostals;
  }
}
