fx_version "cerulean"
game "gta5"

author "Dev-CasperTheGhost"
description "Sync SnailyCAD's signal 100s with FiveM."
version "0.5.0"

ui_page "nui/index.html"

files {
  "nui/**/*",
}

client_scripts {"client/client.js"}
server_scripts {"server/server.js"}