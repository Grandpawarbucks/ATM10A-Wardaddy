// QoL: every Relics relic (including Reliquified Artifacts) is fully maxed as soon as it
// lands in a player's inventory: from chest loot, mob drops, quest rewards or /give.
// This does the same thing as the mod's own `/relics relic maximize` command:
// max rank and level, every ability at its max level, unlocked and researched, and every
// stat at max quality. Each maxed relic is stamped with a custom_data tag so it's done once.
// (Relics' own isMaxLevel/isMaxQuality checks don't all report true after maxing some relics,
// so they can't be the guard: using them re-maxed the same relic every tick.)
//
// Why on pickup and not inside the loot table: Relics rolls a relic's random stats when the
// item stack is first created, so changing it after it reaches the player is the reliable point.

const $IRelicItem = Java.loadClass('it.hurts.sskirillss.relics.api.relics.IRelicItem')
const $DataComponents = Java.loadClass('net.minecraft.core.component.DataComponents')
const $CustomData = Java.loadClass('net.minecraft.world.item.component.CustomData')
const MAXED_TAG = 'wardaddy_relic_maxed'

function isStamped(stack) {
  let cd = stack.get($DataComponents.CUSTOM_DATA)
  return cd != null && cd.contains(MAXED_TAG)
}

function maximizeRelic(player, stack) {
  let relic = stack.getItem()
  let data = relic.getRelicData(player, stack)

  let leveling = data.getLevelingData()
  leveling.setRank(data.getTemplate().getLeveling().getMaxRank())
  leveling.setLevel(data.calculateMaxLevel())

  let abilities = data.getAbilitiesData()
  data.getTemplate().getAbilities().getAbilities().forEach((id, template) => {
    let ability = abilities.getAbilityData(id)
    ability.setLevel(template.getInitialMaxLevel())
    let lock = ability.getLockData()
    lock.setUnlocks(lock.getMaxUnlocks())
    ability.getResearchData().complete()
    template.getStats().keySet().forEach(statId => {
      let stat = ability.getStatData(statId)
      stat.setInitialQuality(stat.getMaxQuality())
    })
  })
  $CustomData.update($DataComponents.CUSTOM_DATA, stack, tag => tag.putBoolean(MAXED_TAG, true))
  return data
}

// The event's item is a copy (vanilla menus pass copies to slot listeners), so edits to it
// never reach the player. Edit the real stack in the slot instead. The event also fires every
// tick for relics because Relics updates its own usage statistics on them, so keep this cheap.
function realStack(event) {
  try {
    let slot = event.player.inventoryMenu.getSlot(event.slot)
    let real = slot.getItem()
    if (real != null && !real.isEmpty() && real.getItem() == event.item.getItem()) return real
  } catch (e) { /* fall through */ }
  return null
}

PlayerEvents.inventoryChanged(event => {
  if (event.item == null || event.item.isEmpty()) return
  if (!(event.item.getItem() instanceof $IRelicItem)) return
  let stack = realStack(event)
  if (stack == null) return
  if (!(stack.getItem() instanceof $IRelicItem)) return
  if (isStamped(stack)) return
  try {
    let data = maximizeRelic(event.player, stack)
    console.info(`[QoL relics] maxed ${stack.getId()} for ${event.player.username} ` +
      `(rank ${data.isMaxRank()}, level ${data.isMaxLevel()}, quality ${data.isMaxQuality()})`)
  } catch (e) {
    console.warn(`[QoL relics] could not max ${stack.getId()}: ${e}`)
  }
})
