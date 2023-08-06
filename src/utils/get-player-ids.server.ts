interface PlayerIdentifiers {
  steamId: string | null;
  discordId: string | null;
}

export function getPlayerIds(source: number) {
  const _identifiers = getPlayerIdentifiers(source);
  const identifiers: PlayerIdentifiers = { steamId: null, discordId: null };

  for (const identifier of _identifiers) {
    if (identifier.includes("steam")) {
      identifiers.steamId = identifier;
    } else if (identifier.includes("discord")) {
      identifiers.discordId = identifier;
    }
  }

  return identifiers;
}
