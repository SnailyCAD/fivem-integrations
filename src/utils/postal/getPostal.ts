/**
 * script originally created by nick-perry14 on GitHub in LUA
 *
 * - https://github.com/nick-perry14
 */

import defaultPostals from "./postals.json";

export async function getPostal(playerPosition: { x: number; y: number }): Promise<string | null> {
  const postals = await getPostalCodes();

  let nearestPoint: { code: string } | null = null;
  let minDistance: number | null = null;

  for (const point of postals) {
    // eslint-disable-next-line unicorn/prefer-modern-math-apis
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
    return exports["sna-postals"]["readPostalCodes"]?.();
  } catch (error) {
    console.error(error);
    return defaultPostals;
  }
}
