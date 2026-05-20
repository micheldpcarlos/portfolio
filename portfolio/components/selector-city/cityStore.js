// cityStore.js
// A tiny shared reactive store (no Pinia needed). All Selector City components
// import this module and read/write the same single instance.

import { reactive, computed } from 'vue'
import { createInitialCity, snapshotTarget, applyEventToCity } from './cityModel.js'
import { SELECTOR_CATALOG, CITY_EVENTS } from './selectorCatalog.js'
import { evaluateSelector } from './evaluateSelector.js'

const clone = (obj) => JSON.parse(JSON.stringify(obj))

const firstCity = createInitialCity()

export const state = reactive({
  city: firstCity,                       // the current, mutable city
  originalTarget: snapshotTarget(firstCity), // frozen identity of the target
  selectedSelectorId: null,              // active card — drives the map animation
  triggeredEvents: [],                   // audit trail, newest first
  lastEventId: null,                     // most recent event (drives map effects)
  reducedMotion: false,                  // set in onMounted via matchMedia
  navTick: 0,                            // bumps to re-trigger map animations
})

// Each selector's status against the CURRENT city. Recomputes on any change.
export const statusMap = computed(() => {
  const map = {}
  for (const sel of SELECTOR_CATALOG) {
    map[sel.id] = evaluateSelector(sel.id, state.city, state.originalTarget)
  }
  return map
})

// How many times each event has been fired.
export const eventCounts = computed(() => {
  const counts = {}
  for (const ev of state.triggeredEvents) {
    counts[ev.id] = (counts[ev.id] || 0) + 1
  }
  return counts
})

// Per selector: of the distinct event TYPES the user has triggered, how many
// did this selector survive? Computed by replaying each event on a fresh city.
export const survivedCounts = computed(() => {
  const types = [...new Set(state.triggeredEvents.map((e) => e.id))]
  const out = {}
  for (const sel of SELECTOR_CATALOG) {
    let survived = 0
    for (const type of types) {
      const city = createInitialCity()
      const original = snapshotTarget(city)
      applyEventToCity(city, type)
      if (evaluateSelector(sel.id, city, original).found) survived++
    }
    out[sel.id] = { survived, total: types.length }
  }
  return out
})

export const brokenCount = computed(() => {
  let n = 0
  for (const sel of SELECTOR_CATALOG) {
    if (statusMap.value[sel.id].broke) n++
  }
  return n
})

export function selectSelector(id) {
  state.selectedSelectorId = state.selectedSelectorId === id ? null : id
  state.navTick++
}

export function applyCityEvent(eventId) {
  const meta = CITY_EVENTS.find((e) => e.id === eventId)
  if (!meta) return
  const next = clone(state.city)
  applyEventToCity(next, eventId)
  state.city = next
  state.lastEventId = eventId
  state.navTick++
  state.triggeredEvents = [
    { id: eventId, label: meta.label, icon: meta.icon, at: nowLabel() },
    ...state.triggeredEvents,
  ].slice(0, 10)
}

export function resetCity() {
  const fresh = createInitialCity()
  state.city = fresh
  state.originalTarget = snapshotTarget(fresh)
  state.triggeredEvents = []
  state.lastEventId = null
}

export function setReducedMotion(value) {
  state.reducedMotion = value === true
}

function nowLabel() {
  try {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch (e) {
    return ''
  }
}
