// QoL: multiply the rolls of loot tables. Requires the LootJS mod.
// - Chest tables (structures/dungeons) x3. Lootr chests use these same tables, so they get the bonus too.
// - Entity tables (mob drops) x2.
// Only constant and uniform roll counts are scaled; anything else is left unchanged.
const CHEST_ROLL_MULTIPLIER = 3
const ENTITY_ROLL_MULTIPLIER = 2

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

function scaleRolls(p, mult) {
  if (p == null) return null
  let kind = kindOf(p)
  if (kind == 'constant') return Number(p.value()) * mult
  if (kind == 'uniform') {
    let min = constantOf(p.min())
    let max = constantOf(p.max())
    return (min != null && max != null) ? [min * mult, max * mult] : null
  }
  return null
}

LootJS.lootTables(event => {
  let stats = { chest: [0, 0, 0], entity: [0, 0, 0] } // tables, pools scaled, pools left as-is
  event.forEachTable(table => {
    let type = table.getLootType()
    let key = null, mult = 1
    if (type == LootType.CHEST) { key = 'chest'; mult = CHEST_ROLL_MULTIPLIER }
    else if (type == LootType.ENTITY) { key = 'entity'; mult = ENTITY_ROLL_MULTIPLIER }
    if (key == null) return
    let st = stats[key]
    st[0]++
    // Rhino (KubeJS's JS engine) treats `const` inside a try block in a repeatedly
    // called callback as a redeclaration, so use plain assignment to a let here.
    table.getPools().forEach(pool => {
      let scaled = null
      try {
        scaled = scaleRolls(pool.getVanillaPool().getRolls(), mult)
        if (scaled != null) { pool.rolls(scaled); st[1]++ } else st[2]++
      } catch (e) {
        st[2]++
        console.warn(`[QoL loot] ${table.getLocation()}: ${e}`)
      }
    })
  })
  console.info(`[QoL loot] chest tables: ${stats.chest[0]}, pools x${CHEST_ROLL_MULTIPLIER}: ${stats.chest[1]}, pools left as-is: ${stats.chest[2]}`)
  console.info(`[QoL loot] entity tables: ${stats.entity[0]}, pools x${ENTITY_ROLL_MULTIPLIER}: ${stats.entity[1]}, pools left as-is: ${stats.entity[2]}`)
})
