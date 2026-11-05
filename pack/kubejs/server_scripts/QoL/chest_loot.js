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
  const s = String(p)
  if (s.indexOf('ConstantValue[') == 0) return 'constant'
  if (s.indexOf('UniformGenerator[') == 0) return 'uniform'
  return null
}

function scaleRolls(p) {
  if (p == null) return null
  const kind = kindOf(p)
  if (kind == 'constant') return ConstantValue.exactly(p.value() * LOOT_ROLL_MULTIPLIER)
  if (kind == 'uniform') {
    const min = scaleRolls(p.min())
    const max = scaleRolls(p.max())
    return (min && max) ? new UniformGenerator(min, max) : null
  }
  return null
}

LootJS.lootTables(event => {
  let tables = 0, pools = 0, skipped = 0
  event.forEachTable(table => {
    if (table.getLootType() != LootType.CHEST) return
    tables++
    table.getPools().forEach(pool => {
      try {
        const scaled = scaleRolls(pool.getVanillaPool().getRolls())
        if (scaled) { pool.rolls(scaled); pools++ } else skipped++
      } catch (e) {
        skipped++
        console.warn(`[QoL loot] ${table.getLocation()}: ${e}`)
      }
    })
  })
  console.info(`[QoL loot] chest tables: ${tables}, pools doubled: ${pools}, pools left as-is: ${skipped}`)
})
