export enum Events {
  WraithPlateLocked = "wk:onPlateLocked",
  ALPRCadPlateResults = "sn:cadPlateResults",
  ALPRCadBoloResults = "sn:cadBoloResults",

  Call911ToClient = "sn:911Call",
  Call911ToServer = "sn:911CallUpdate",
  Call911ToClientResponse = "sn:911CallResponse",

  TowCallToClient = "sn:towCall",
  TowCallToServer = "sn:towCallUpdate",
  TowCallToClientResponse = "sn:towCallResponse",

  TaxiCallToClient = "sn:taxiCall",
  TaxiCallToServer = "sn:taxiCallUpdate",
  TaxiCallToClientResponse = "sn:taxiCallResponse",

  SnSignal100 = "sn:signal100",
  AreaOfPlayChange = "sn:areaOfPlayChange",
}

export interface EventData {
  source: number;
  name: string;
  description: string;
}

export enum SnCommands {
  Call911 = "sn-call911",
  CallTow = "sn-calltow",
  CallTaxi = "sn-calltaxi",
  WhoAmI = "sn-whoami",
  Auth = "sn-auth",
  ActiveUnit = "sn-active-unit",
  SetStatus = "sn-set-status",
  PanicButton = "sn-panic-button",
}

export enum ServerEvents {
  /**
   * the user has successfully authenticated with SnailyCAD's API.
   * We now want to request to save the user token in KVP storage */
  OnUserSave = "sna-sync:on-user-save",

  /**
   * the user has selected a status code, we now want to send
   * an API request to the SnailyCAD API on the server-side.
   */
  OnSetUnitStatus = "sna-sync:on-set-unit-status",
}

export enum ClientEvents {
  /**
   * the user has requested to authenticate with SnailyCAD's API. We
   * want to open the modal to allow the user to enter their API token.
   */
  RequestAuthFlow = "sna-sync:request-authentication-flow",

  /**
   * the user has requested to set their unit's status. We now
   * want to open the modal to allow the user to set their status.
   */
  RequestSetStatusFlow = "sna-sync:request-set-status-flow",
}

export enum NuiEvents {
  CloseAuthenticationFlow = "sna-sync-nui:close-authentication-flow",
  OnAuthenticationFlowSuccess = "sna-sync-nui:authentication-flow-success",
  CloseSetStatusFlow = "sna-sync-nui:close-set-status-flow",
  OnSetUnitStatus = "sna-sync-nui:set-unit-status",
  /** a connection was established to the SnailyCAD API. */
  Connected = "sna-sync-nui:connected",
  /** an error occurred while connecting to the SnailyCAD API. */
  ConnectionError = "sna-sync-nui:connect_error",
  /** a socket event for `Signal100` was received from the SnailyCAD API. */
  Signal100 = "sna-sync-nui:signal100",
  /** a socket event for `UpdateAreaOfPlay` was received from the SnailyCAD API. */
  UpdateAreaOfPlay = "sna-sync-nui:update-area-of-play",
}
