// QoL gamerules - applied every time the server/world loads so all worlds get them.
// keepInventory: players keep items and XP on death (no grave mod is installed).
// playersSleepingPercentage: only half the online players need to sleep to skip the night.
// randomTickSpeed: 3 is vanilla. 6 doubles crop, sapling, sugar cane and other random-tick growth.
ServerEvents.loaded(event => {
  event.server.runCommandSilent('gamerule keepInventory true')
  event.server.runCommandSilent('gamerule playersSleepingPercentage 50')
  event.server.runCommandSilent('gamerule randomTickSpeed 6')
})
