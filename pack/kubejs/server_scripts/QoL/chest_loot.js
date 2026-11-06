// QoL: double the rolls of every structure/dungeon chest loot table. Requires the LootJS mod.
// Lootr chests use these same tables, so they get the bonus too.
// Only constant and uniform roll counts are scaled; anything else is left unchanged.
const LOOT_ROLL_MULTIPLIER = 2

const NUM = 'net.minecraft.world.level.storage.loot.providers.number.'
const ConstantValue = Java.loadClass(NUM + 'ConstantValue')
const UniformGenerator = Java.loadClass(NUM + 'UniformGenerator')

// KubeJS blocks getClass(), so detect the type with instanceof, falling back to the
// record's toString() ("ConstantValue[value=1.0]", "UniformGenerator[min=..., max=...]").
function kindOf(p) {
  try {
    if (p instanceof ConstantValue) return 'constant'
    if (p instanceof UniformGenerator) return 'uniform'
  } catch (e) { /* fall through */ }
  let s = String(p)
  if (s.indexOf('ConstantValue[') == 0) return 'constant'
  if (s.indexOf('UniformGenerator[') == 0) return 'uniform'
  return null
}

// Returns the scaled rolls as plain JS values that LootJS's pool.rolls() accepts:
// a number for a constant roll count, or [min, max] for a uniform range.
// Passing Java NumberProvider objects (ConstantValue/UniformGenerator) makes KubeJS's
// type wrapper throw "Failed to read NumberProvider", which aborts the whole event.
function constantOf(p) {
  return (p != null && kindOf(p) == 'constant') ? Number(p.value()) : null
}

function scaleRolls(p) {
  if (p == null) return null
  let kind = kindOf(p)
  if (kind == 'constant') return Number(p.value()) * LOOT_ROLL_MULTIPLIER
  if (kind == 'uniform') {
    let min = constantOf(p.min())
    let max = constantOf(p.max())
    return (min != null && max != null) ? [min * LOOT_ROLL_MULTIPLIER, max * LOOT_ROLL_MULTIPLIER] : null
  }
  return null
}

LootJS.lootTables(event => {
  let tables = 0, pools = 0, skipped = 0
  event.forEachTable(table => {
    if (table.getLootType() != LootType.CHEST) return
    tables++
    // Rhino (KubeJS's JS engine) treats `const` inside a try block in a repeatedly
    // called callback as a redeclaration, so use plain assignment to a let here.
    table.getPools().forEach(pool => {
      let scaled = null
      try {
        scaled = scaleRolls(pool.getVanillaPool().getRolls())
        if (scaled != null) { pool.rolls(scaled); pools++ } else skipped++
      } catch (e) {
        skipped++
        console.warn(`[QoL loot] ${table.getLocation()}: ${e}`)
      }
    })
  })
  console.info(`[QoL loot] chest tables: ${tables}, pools doubled: ${pools}, pools left as-is: ${skipped}`)
})
