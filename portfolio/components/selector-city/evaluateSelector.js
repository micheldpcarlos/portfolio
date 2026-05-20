// evaluateSelector.js
// Pure oracle: given a selector type, the CURRENT (possibly mutated) city, and
// the immutable snapshot of the original target, decide whether the selector
// still resolves to that house. No DOM, no side effects.

import { createInitialCity, snapshotTarget, applyEventToCity } from './cityModel.js'
import { SELECTOR_CATALOG, CITY_EVENTS } from './selectorCatalog.js'

const ok = (reason) => ({ found: true, broke: false, reason })
const broke = (reason) => ({ found: false, broke: true, reason })

function arrEq(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

export function evaluateSelector(selectorId, city, original) {
  const target = city.houses.find((h) => h.id === original.id)
  if (!target) return broke('The target element no longer exists.')
  const street = city.streets.find((s) => s.id === target.streetId)

  switch (selectorId) {
    case 'xpath-abs':
      return arrEq(target.domPath, original.domPath)
        ? ok('The directions still lead to the right door.')
        : broke('A structural change shifted the path — the directions now lead to the wrong door.')

    case 'nth-child':
      return target.lot === original.lot && target.streetId === original.streetId
        ? ok('Still the same numbered house on the same street.')
        : broke('A sibling was inserted or re-ordered — the count is off by one or more.')

    case 'structure':
      return arrEq(target.ancestry, original.ancestry)
        ? ok('The surrounding block shape is unchanged.')
        : broke('A DOM refactor reshaped the block — the structure no longer matches.')

    case 'class': {
      const matches = city.houses.filter((h) =>
        h.classes.includes(original.distinctiveClass),
      )
      if (matches.length === 0)
        return broke('A rebrand repainted the city — that class name no longer exists.')
      if (matches.length > 1 || matches[0].id !== original.id)
        return broke('Another house now shares that paint colour — the match is ambiguous.')
      return ok('The paint colour still uniquely marks the house.')
    }

    case 'scoped-css': {
      if (!street || street.name !== original.streetName)
        return broke('The street was renamed — the landmark in the selector is gone.')
      const attrValue = target.attrs ? (target.attrs[original.attrKey] ?? null) : null
      if (attrValue !== original.attrValue)
        return broke('The local attribute changed.')
      return ok('A stable street name plus a local attribute still resolve.')
    }

    case 'text':
      return target.text === original.text
        ? ok('The visible text still reads the same.')
        : broke('The visible text was rewritten — "' + original.text + '" is gone.')

    case 'aria':
      return target.ariaRole === original.ariaRole && target.ariaName === original.ariaName
        ? ok('The role and accessible name still identify the building.')
        : broke('The role or accessible name changed.')

    case 'id':
      return target.idAttr != null && target.idAttr === original.idAttr
        ? ok('The unique id is untouched.')
        : broke('The id changed or was removed.')

    case 'testid':
      return target.testId != null && target.testId === original.testId
        ? ok('The data-testid pin is untouched — couriers still arrive.')
        : broke('The data-testid was removed.')

    default:
      return broke('Unknown selector.')
  }
}

// How many of the five city events a selector survives in isolation (0..5).
// Computed once at module load by replaying each event on a fresh city.
function robustnessFor(selectorId) {
  let survived = 0
  for (const ev of CITY_EVENTS) {
    const city = createInitialCity()
    const original = snapshotTarget(city)
    applyEventToCity(city, ev.id)
    if (evaluateSelector(selectorId, city, original).found) survived++
  }
  return survived
}

export const ROBUSTNESS = Object.fromEntries(
  SELECTOR_CATALOG.map((s) => [s.id, robustnessFor(s.id)]),
)

export const MAX_ROBUSTNESS = CITY_EVENTS.length
