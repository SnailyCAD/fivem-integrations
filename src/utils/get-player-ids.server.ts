interface PlayerIdentifiers {
  steamId: string | null;
  discordId: string | null;
}

export function getPlayerIds<ReturnType extends "object" | "array">(
  source: number,
  returnType: ReturnType,
): ReturnType extends "object" ? PlayerIdentifiers : string[] {
  const _identifiers = getPlayerIdentifiers(source);
  const identifiers: PlayerIdentifiers = { steamId: null, discordId: null };
  const identifiersArray: string[] = [];

  if (returnType === "object") {
    for (const identifier of _identifiers) {
      if (identifier.includes("steam")) {
        identifiers.steamId = identifier;
      } else if (identifier.includes("discord")) {
        identifiers.discordId = identifier;
      }
    }

    return identifiers as ReturnType extends "object" ? PlayerIdentifiers : string[];
  }

  for (const identifier of _identifiers) {
    identifiersArray.push(identifier);
  }

  return identifiersArray as ReturnType extends "object" ? PlayerIdentifiers : string[];
}
