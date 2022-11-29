export enum Events {
  WraithPlateLocked = "wk:onPlateLocked",
  ALPRCadPlateResults = "sn:cadPlateResults",

  Call911ToClient = "sn:911Call",
  Call911ToServer = "sn:911CallUpdate",

  TowCallToClient = "sn:towCall",
  TowCallToServer = "sn:towCallUpdate",

  TaxiCallToClient = "sn:taxiCall",
  TaxiCallToServer = "sn:taxiCallUpdate",
}

export interface EventData {
  name: string;
  description: string;
}
