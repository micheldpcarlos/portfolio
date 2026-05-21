// cityModel.js
// The "city" is the DOM. A "house" is an element. Each house carries every
// attribute a selector could possibly key on, so city-change events can mutate
// it and evaluateSelector() can re-judge whether a selector still finds it.

function house(id, streetId, lot, props) {
  return {
    id,
    streetId,
    lot,                              // position index on the street (nth-child)
    tag: props.tag,
    classes: props.classes,           // the "paint colours"
    attrs: props.attrs || {},         // generic attributes (scoped-CSS keys on these)
    idAttr: props.idAttr ?? null,     // the #id — a unique house number
    testId: props.testId ?? null,     // data-testid — the planted GPS pin
    text: props.text ?? null,         // visible text — the mailbox nameplate
    ariaRole: props.ariaRole,         // what the building IS
    ariaName: props.ariaName,         // accessible name — drone-readable label
    domPath: props.domPath,           // absolute path indices (XPath)
    ancestry: props.ancestry,         // ancestor tag chain (structure selectors)
    color: props.color,
    isTarget: props.isTarget === true,
    isNew: props.isNew === true,      // inserted by a city event
  }
}

// One immutable starting city. Exactly one house is the target: the signup
// form's submit button on Maple Street.
export function createInitialCity() {
  return {
    streets: [
      { id: 'st-main', label: 'Main Street', name: 'site-header' },
      { id: 'st-maple', label: 'Maple Street', name: 'signup-form' },
      { id: 'st-oak', label: 'Oak Street', name: 'site-footer' },
    ],
    houses: [
      house('h-logo', 'st-main', 0, {
        tag: 'img', classes: ['brand'], attrs: {},
        ariaRole: 'img', ariaName: 'Acme logo', text: null,
        color: '#3f6fd1', domPath: [1, 0], ancestry: ['header', 'div', 'img'],
      }),
      house('h-nav', 'st-main', 1, {
        tag: 'a', classes: ['nav-link'], attrs: { href: '/' },
        ariaRole: 'link', ariaName: 'Home', text: 'Home',
        color: '#3f6fd1', domPath: [1, 1], ancestry: ['header', 'nav', 'a'],
      }),
      house('h-login', 'st-main', 2, {
        tag: 'button', classes: ['btn', 'btn-ghost'], attrs: { type: 'button' },
        ariaRole: 'button', ariaName: 'Log in', text: 'Log in',
        color: '#3f6fd1', domPath: [1, 2], ancestry: ['header', 'nav', 'button'],
      }),

      house('h-name', 'st-maple', 0, {
        tag: 'input', classes: ['field', 'field-name'], attrs: { name: 'fullname', type: 'text' },
        idAttr: 'name-field', testId: 'signup-name',
        ariaRole: 'textbox', ariaName: 'Full name', text: null,
        color: '#1f9f86', domPath: [2, 0], ancestry: ['form', 'div', 'input'],
      }),
      house('h-email', 'st-maple', 1, {
        tag: 'input', classes: ['field', 'field-email'], attrs: { name: 'email', type: 'email' },
        idAttr: 'email-field', testId: 'signup-email',
        ariaRole: 'textbox', ariaName: 'Email address', text: null,
        color: '#1f9f86', domPath: [2, 1], ancestry: ['form', 'div', 'input'],
      }),
      house('h-submit', 'st-maple', 2, {
        tag: 'button', classes: ['btn', 'btn-primary'], attrs: { type: 'submit' },
        idAttr: 'submit-btn', testId: 'signup-submit',
        ariaRole: 'button', ariaName: 'Submit form', text: 'Submit',
        color: '#ff2d95', domPath: [2, 2], ancestry: ['form', 'div', 'button'],
        isTarget: true,
      }),

      house('h-terms', 'st-oak', 0, {
        tag: 'a', classes: ['footer-link'], attrs: { href: '/terms' },
        ariaRole: 'link', ariaName: 'Terms', text: 'Terms',
        color: '#d4922f', domPath: [3, 0], ancestry: ['footer', 'ul', 'a'],
      }),
      house('h-help', 'st-oak', 1, {
        tag: 'a', classes: ['footer-link'], attrs: { href: '/help' },
        ariaRole: 'link', ariaName: 'Help', text: 'Help',
        color: '#d4922f', domPath: [3, 1], ancestry: ['footer', 'ul', 'a'],
      }),
      house('h-social', 'st-oak', 2, {
        tag: 'a', classes: ['footer-link', 'icon'], attrs: { href: '/social' },
        ariaRole: 'link', ariaName: 'Social', text: null,
        color: '#d4922f', domPath: [3, 2], ancestry: ['footer', 'ul', 'a'],
      }),
    ],
  }
}

export function targetHouse(city) {
  return city.houses.find((h) => h.isTarget)
}

// A frozen snapshot of the target's identity at init. Selectors are judged by
// whether they still resolve to THIS house after the city is mutated.
export function snapshotTarget(city) {
  const t = targetHouse(city)
  const counts = {}
  for (const h of city.houses) {
    for (const c of h.classes) counts[c] = (counts[c] || 0) + 1
  }
  // distinctive class = the one held by the fewest houses (the class a real
  // selector would pick). At init this is unique to the target.
  let distinctiveClass = t.classes[0]
  for (const c of t.classes) {
    if (counts[c] < counts[distinctiveClass]) distinctiveClass = c
  }
  const street = city.streets.find((s) => s.id === t.streetId)
  return {
    id: t.id,
    streetId: t.streetId,
    streetName: street.name,
    lot: t.lot,
    tag: t.tag,
    classes: [...t.classes],
    distinctiveClass,
    attrKey: 'type',
    attrValue: t.attrs.type ?? null,
    idAttr: t.idAttr,
    testId: t.testId,
    text: t.text,
    ariaRole: t.ariaRole,
    ariaName: t.ariaName,
    domPath: [...t.domPath],
    ancestry: [...t.ancestry],
  }
}

// ---------------------------------------------------------------------------
// City-change events. Each mutates a (already-cloned) city in place.
// They never touch idAttr / testId / ariaRole / ariaName unless that is the
// specific lesson — stability there is the whole point.
// ---------------------------------------------------------------------------

export function applyEventToCity(city, eventId) {
  switch (eventId) {
    case 'insert-house': return insertHouse(city)
    case 'repaint': return repaint(city)
    case 'rename-street': return renameStreet(city)
    case 'residents-move': return residentsMove(city)
    case 'refactor-district': return refactorDistrict(city)
    default: return
  }
}

// Insert a new element right before the target — every count after it shifts.
function insertHouse(city) {
  const t = targetHouse(city)
  const L = t.lot
  for (const h of city.houses) {
    if (h.streetId === t.streetId && h.lot >= L) {
      h.lot += 1
      const p = [...h.domPath]
      p[p.length - 1] += 1
      h.domPath = p
    }
  }
  const seq = city.houses.filter((h) => h.isNew).length + 1
  city.houses.push(
    house(`h-new-${seq}`, t.streetId, L, {
      tag: 'div', classes: ['promo'], attrs: {},
      ariaRole: 'note', ariaName: 'Promo banner', text: 'New!',
      color: '#8a8f9c', domPath: [t.domPath[0], L], ancestry: ['form', 'div', 'div'],
      isNew: true,
    }),
  )
}

const BRAND_PREFIXES = ['ui', 'theme', 'shell', 'core', 'app', 'v3']
const REPAINT_PALETTE = [
  '#9b6cff', '#ff8d3a', '#ff5d8f', '#46c7ff', '#ffc14d',
  '#5bd6a8', '#ff6b9d', '#7c8cff', '#3fcf8e', '#e8b84b',
]
const BUTTON_TEXTS = ['Continue', 'Sign up', 'Get started', 'Join now', 'Register', 'Confirm']
const STREET_NAMES = ['register-form', 'checkout-form', 'auth-panel', 'profile-form', 'wizard-step']

// Pick a random item from `list` that is not `current` — guarantees a visible
// change every time the event fires.
function pickDifferent(list, current) {
  const options = list.filter((x) => x !== current)
  return options[Math.floor(Math.random() * options.length)]
}

function stripBrandPrefix(cls) {
  for (const p of BRAND_PREFIXES) {
    if (cls.startsWith(p + '-')) return cls.slice(p.length + 1)
  }
  return cls
}

function currentBrand(city) {
  const t = targetHouse(city)
  for (const p of BRAND_PREFIXES) {
    if (t.classes.some((c) => c.startsWith(p + '-'))) return p
  }
  return null
}

// A rebrand: every class is renamed under a fresh brand prefix and every house
// is recoloured — a different brand and colours each time.
function repaint(city) {
  const brand = pickDifferent(BRAND_PREFIXES, currentBrand(city))
  for (const h of city.houses) {
    h.color = REPAINT_PALETTE[Math.floor(Math.random() * REPAINT_PALETTE.length)]
    h.classes = h.classes.map((c) => brand + '-' + stripBrandPrefix(c))
  }
}

// The form's wrapper class is renamed — a fresh name each time. Anything
// scoped to that wrapper class loses its anchor.
function renameStreet(city) {
  const t = targetHouse(city)
  const street = city.streets.find((s) => s.id === t.streetId)
  street.name = pickDifferent(STREET_NAMES, street.name)
}

// A copy edit rewrites the button's visible text — a fresh wording each time.
// The accessible name (aria-label) is managed separately and stays put.
function residentsMove(city) {
  const t = targetHouse(city)
  t.text = pickDifferent(BUTTON_TEXTS, t.text)
}

// The form markup is restructured: positions, paths and the nesting chain all
// change — but the element keeps its classes and stays inside the same form
// (the <form> wrapper, and so the street name, survive).
function refactorDistrict(city) {
  const t = targetHouse(city)
  const onStreet = city.houses.filter((h) => h.streetId === t.streetId)
  const others = onStreet
    .filter((h) => h.id !== t.id)
    .sort((a, b) => a.lot - b.lot)
  t.lot = 0
  others.forEach((h, i) => { h.lot = i + 1 })
  for (const h of onStreet) {
    h.ancestry = ['form', 'section', 'fieldset', h.tag]
    h.domPath = [4, h.lot]
  }
}
