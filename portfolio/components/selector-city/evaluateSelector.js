// evaluateSelector.js
// Pure oracle: given a selector id, the CURRENT (possibly mutated) city, and
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

  switch (selectorId) {
    case 'xpath-abs':
      return arrEq(target.domPath, original.domPath)
        ? ok('The path still resolves.')
        : broke('The path shifted — it leads to the wrong door now.')

    case 'css-nth':
      return target.lot === original.lot && target.streetId === original.streetId
        ? ok('Same position on the same street.')
        : broke('A sibling shifted the :nth-child count.')

    case 'css-structure':
      return arrEq(target.ancestry, original.ancestry)
        ? ok('The nesting chain still matches.')
        : broke('A refactor reshaped the block — the descendant chain is gone.')

    case 'xpath-text':
      return target.text === original.text
        ? ok('The visible text still matches.')
        : broke('The visible text changed — the match is gone.')

    case 'css-class': {
      const matches = city.houses.filter((h) =>
        h.classes.includes(original.distinctiveClass),
      )
      if (matches.length === 0)
        return broke('The rebrand renamed the class away.')
      if (matches.length > 1 || matches[0].id !== original.id)
        return broke('Another element now shares the class.')
      return ok('The class still uniquely matches.')
    }

    case 'aria-implicit':
      if (target.ariaRole !== original.ariaRole)
        return broke('The role changed.')
      return target.text === original.text
        ? ok('Role and visible-text name still match.')
        : broke('The visible text changed — the name no longer matches.')

    case 'aria-explicit':
      return target.ariaRole === original.ariaRole &&
        target.ariaName === original.ariaName
        ? ok('Role and aria-label still match.')
        : broke('The role or aria-label changed.')

    case 'css-id':
      return target.idAttr != null && target.idAttr === original.idAttr
        ? ok('The id still matches.')
        : broke('The id changed or was removed.')

    case 'xpath-attr':
      return target.idAttr != null && target.idAttr === original.idAttr
        ? ok('The id attribute is untouched.')
        : broke('The id changed or was removed.')

    case 'css-testid':
      return target.testId != null && target.testId === original.testId
        ? ok('The data-testid is untouched.')
        : broke('The data-testid was removed.')

    default:
      return broke('Unknown selector.')
  }
}

// How many of the city events a selector survives in isolation (0..N).
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
