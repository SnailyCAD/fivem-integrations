fx_version "bodacious"
game "gta5"

author "Casper Iversen"
description "Sync SnailyCAD with FiveM."
version "0.13.1"

ui_page "nui/index.html"

files {
  "nui/**/*",
}

client_scripts {"client/client.js"}
server_scripts {"server/server.js"}