// QoL: the AllTheOres ore hammer gives more dust from ores and raw ores.
// Stock is 1 ore -> 2 dust and 1 raw ore -> 2 dust; this doubles both to 4.
// Ingot -> dust is left at 1:1 on purpose: more than 1 would be an infinite loop
// (ingot -> 2 dust -> smelt to 2 ingots -> ...).
const HAMMER_DUST_MULTIPLIER = 2

ServerEvents.recipes(event => {
  let changed = 0
  // No bare "/" inside the regex (e.g. [^/]): KubeJS re-parses it as a string and cuts at the "/".
  event.forEachRecipe({ id: /^alltheores:crafting\/hammer\/\w+\/dust_from_(ore|raw)$/ }, recipe => {
    try {
      let out = recipe.get('result')
      if (out == null || out.isEmpty()) return
      recipe.set('result', Item.of(out.getId(), out.getCount() * HAMMER_DUST_MULTIPLIER))
      changed++
    } catch (e) {
      console.warn(`[QoL hammer] skipped ${recipe.getId()}: ${e}`)
    }
  })
  console.info(`[QoL hammer] ore/raw hammer dust recipes x${HAMMER_DUST_MULTIPLIER}: ${changed}`)
})
