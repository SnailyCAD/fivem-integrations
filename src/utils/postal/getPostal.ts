/**
 * script originally created by nick-perry14 on GitHub in LUA
 *
 * - https://github.com/nick-perry14
 */

import { resolve } from "node:path";
import defaultPostals from "./postals.json";

export async function getPostal(playerPosition: { x: number; y: number }): Promise<string | null> {
  const postals = await getPostalCodes();

  let nearestPoint: { code: string } | null = null;
  let minDistance: number | null = null;

  for (const point of postals) {
    const distance = Math.sqrt(
      (point.x - playerPosition.x) ** 2 + (point.y - playerPosition.y) ** 2,
    );

    if (minDistance === null || distance < minDistance) {
      nearestPoint = point;
      minDistance = distance;
    }
  }

  return nearestPoint ? nearestPoint.code : null;
}

async function getPostalCodes() {
  try {
    const resourceName = "sna-postals";
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
