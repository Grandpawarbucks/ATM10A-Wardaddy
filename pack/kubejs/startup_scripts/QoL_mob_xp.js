// QoL: mobs drop double experience.
// This is a startup script, so the listener is registered once per game launch
// and a /reload can't register it again and stack the bonus.
const MOB_XP_MULTIPLIER = 2

const $LivingExperienceDropEvent = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingExperienceDropEvent')

NativeEvents.onEvent($LivingExperienceDropEvent, event => {
  let xp = event.getDroppedExperience()
  if (xp > 0) event.setDroppedExperience(xp * MOB_XP_MULTIPLIER)
})

console.info(`[QoL xp] mob experience x${MOB_XP_MULTIPLIER} registered`)
