# @snailycad/fivem-integrations

This repository includes several FiveM integrations for [SnailyCADv4](https://github.com/snailycad/snaily-cadv4).

[Please see documenation here](https://docs.snailycad.org/docs/fivem-integrations/scripts)

## Installation

For regular installation please see the [documentation](https://docs.snailycad.org/docs/fivem-integrations/scripts).

## Integrations

### `sna-alpr`

This must be used together with the [Wraith ARS 2X resource](https://forum.cfx.re/t/release-wraith-ars-2x-police-radar-and-plate-reader-v1-3-1/1058277).
When a player runs a plate, it will automatically search the plate in your SnailyCAD instance.

### `sna-call911`

This will allow a player to contact 911 Services from the chat. `/sn-call911 <message>`

### `sna-calltow`

This will allow a player to contact Tow Services from the chat. `/sn-calltow <message>`

### `sna-calltaxi`

This will allow a player to contact Taxi Services from the chat. `/sn-calltaxi <message>`

### `sna-postals`

When this is enabled, it will automatically send the current postal code when a player contacts 911, Tow or Taxi services.
[For further details see the documentation](https://docs.snailycad.org/docs/fivem-integrations/live-map/how-to-set-custom-postals).

### `sna-sync`

This will allow a player to interact with your SnailyCAD instance from the game. [For further details see the documentation](https://docs.snailycad.org/docs/fivem-integrations/scripts).

## Developer Docs

### Source code installation

> **Warning**
> This is only for developers who want to contribute to the project.

1. Clone the repository: `git clone https://github.com/SnailyCAD/fivem-integrations.git`.
2. Install dependencies: `pnpm install`.
3. Copy `.env.example` to `.env` and enter your FXServer path.
4. Run the dev command `pnpm run dev`. This will listen for changes and automatically update the files in your FXServer.
5. Manually run `restart <resource>` in your FXServer console to restart the resource.

### Publishing

1. Run the bump releases script: `node scripts/bump-version.mjs <version-here>`.
2. Commit the changes: `git commit -am "chore(release): <version-here>`.
3. Push the changes: `git push`.
