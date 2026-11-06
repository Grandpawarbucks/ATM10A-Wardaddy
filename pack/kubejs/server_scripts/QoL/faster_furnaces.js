// QoL: vanilla Furnace, Blast Furnace and Smoker recipes cook in a quarter of the time.
// Change SPEED_MULTIPLIER to tune (2 = twice as fast). Recipes from mods that use these
// vanilla recipe types are included too.
const SPEED_MULTIPLIER = 4

ServerEvents.recipes(event => {
  let changed = 0
  ;['minecraft:smelting', 'minecraft:blasting', 'minecraft:smoking'].forEach(type => {
    event.forEachRecipe({ type: type }, recipe => {
      try {
        let v = recipe.get('cookingtime')
        let ticks = 200
        if (v != null) ticks = (typeof v === 'number') ? v : Number(v.ticks !== undefined ? (typeof v.ticks === 'function' ? v.ticks() : v.ticks) : v)
        if (!isFinite(ticks) || ticks <= 1) return
        recipe.set('cookingtime', Math.max(1, Math.floor(ticks / SPEED_MULTIPLIER)))
        changed++
      } catch (e) {
        console.warn(`[QoL furnaces] skipped ${recipe.getId()}: ${e}`)
      }
    })
  })
  console.info(`[QoL furnaces] sped up ${changed} cooking recipes x${SPEED_MULTIPLIER}`)
})
