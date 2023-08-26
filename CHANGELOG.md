## 0.11.0

<<<<<<< HEAD
- refactor: rewrite NUI to use React
- chore: update dependencies
- chore: add update checker
- chore: code refactor
=======
- feat: logout command `/sn-logout`.
- feat: DMV/Register Vehicle command `/sn-register-vehicle`.
- feat: Register Weapon command `/sn-register-weapon`.
- refactor: rewrite NUI to use React.
- chore: update dependencies.
>>>>>>> 67622b2 (feat: register vehicle/weapon flows)

## 0.10.1

- fix: clarify usage of Personal API Tokens.

## 0.10.0

- feat: use custom SnailyCAD notification system for ALPR results (`sna-alpr`).

> [!WARNING]
> SnailyCAD's ALPR integration (`sna-alpr`) now requires `sna-sync` to be installed and started in your FXServer.

- chore: use official SnailyCAD util packages.

## 0.9.1

- fix: ALPR BOLO results
- feat: type-safety with official SnailyCAD types

## 0.9.0

- Custom In-Game notification system. This is in beta and will be improved over time.

> [!WARNING]
> Requires SnailyCAD version `1.68.1` or higher.

## 0.8.0

- Automatically set a unit off-duty when they leave the server. [(Disabled by default)](https://docs.snailycad.org/docs/fivem-integrations/scripts/sna-sync#configuration)

## 0.7.1

- Downgrade `sna-sync` to fxversion `bodacious` to allow HTTP connections to SnailyCAD inside NUI.

## 0.7.0

- Add `sn-traffic-stop` command. This allows units to create a 911 call for a traffic stop. Their current location is automatically attached and they're automatically assigned to the call.

## 0.6.0

- Add `documentation.url` shortcuts to the resources.
- Ability to assign yourself to a call using `/sn-attach <case-number>`.
- Ability to view all active calls and assign/unassign yourself to/from a call using `/sn-attach`.
- Update dependencies.

## 0.5.0

- Add `sn-panic-button` command. This allows players to toggle panic button state on their active unit.
- Update older commands to use the new SnailyCAD format. (`sn-call911`, `sn-calltow`, `sn-calltaxi`).
- Add chat suggestions for other commands (`sn-call911`, `sn-calltow`, `sn-calltaxi`).
- Append correct version to the `fxmanifest.lua` files.

## 0.4.0

Building on top of the previous release, players who are authenticated with SnailyCAD (using the `sn-auth` command.) are now able to view their active unit and set the status for their active unit.

- Add `sn-set-status` command. This allows players to set their status for their active unit. (If no argument is provided, it will open a menu with all available codes)
- Add `sn-active-unit` command. This allows players to view their active unit.

## 0.3.0

- Add `sn-whoami` command. This allows players to view their current SnailyCAD username and ID.
- Add `sn-auth` command. This allows players to authenticate with SnailyCAD's API and interact with the CAD in-game.

## 0.2.1

- Add debug logging for `sna-sync`

## 0.2.0

- feat: add `sna-sync`: Sync AOP changes, Signal 100 toggles to all players

## 0.1.7

- fix(sna-alpr): remove spaces from plates

## 0.1.5

- update dependencies

## 0.1.4

- fix: correctly calculate distances for postals

## 0.1.3

- Update dependencies

## 0.1.2

- Add support for `gtaMapPosition` for `/call911`
- Update dependencies

## 0.1.1

- Remove debug logs
- Set fx version to `cerulean`

## 0.1.0

- Fix sna-alpr
- Update dependencies

## 0.0.6

- Update dependencies

## 0.0.4

- feat: add `/calltaxi` support

## 0.0.3

- feat: Show message if owner has active warrants

## 0.0.2

- Add postal support
- Updated documentation

## 0.0.1

- Initial Release
