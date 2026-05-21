// selectorCatalog.js
// Three Puppeteer selector engines — ARIA (aria/), CSS and XPath (xpath/) —
// each shown across weak -> strong forms. Syntax matches how cloudbrowser's
// browser-tools store selectors. The lesson: the engine doesn't decide
// strength; what the selector is *anchored to* does.
//
// Each city event breaks a distinct anchor:
//   insert-house   -> position / sibling count   (xpath-abs, css-nth)
//   repaint        -> element class names        (css-class)
//   rename-street  -> wrapper / container class  (css-scoped)
//   residents-move -> visible text               (xpath-text, aria-implicit)
//   refactor       -> nesting / structure        (css-structure, + the paths)

export const SELECTOR_CATALOG = [
  // ---- weak ----
  {
    id: 'xpath-abs', family: 'XPath', label: 'Absolute path',
    tier: 1, kind: 'weak', nav: 'route',
    syntax: 'xpath//html/body/form/div[3]',
    metaphor: 'Turn-by-turn directions from the gate.',
    detail: 'Anchored to position — anything inserted or restructured throws it off.',
  },
  {
    id: 'css-nth', family: 'CSS', label: ':nth-child',
    tier: 2, kind: 'weak', nav: 'route',
    syntax: 'form > *:nth-child(3)',
    metaphor: 'Counting houses on the street.',
    detail: 'Anchored to sibling order — reorder or insert and it drifts.',
  },

  // ---- medium ----
  {
    id: 'css-structure', family: 'CSS', label: 'Descendant',
    tier: 3, kind: 'medium', nav: 'route',
    syntax: 'form div button',
    metaphor: 'Which house sits inside which block.',
    detail: 'Anchored to the nesting — a refactor reshapes the block and the chain is lost.',
  },
  {
    id: 'css-scoped', family: 'CSS', label: 'Scoped',
    tier: 4, kind: 'medium', nav: 'landmark',
    syntax: '.signup-form button',
    metaphor: 'The button on Signup-Form street.',
    detail: 'Anchored to the wrapper class — rename the form and the scope is gone.',
  },
  {
    id: 'css-class', family: 'CSS', label: 'Class',
    tier: 5, kind: 'medium', nav: 'scan',
    syntax: '.btn-primary',
    metaphor: 'The paint colour of the house.',
    detail: 'Anchored to looks — a rebrand repaints the class away.',
  },
  {
    id: 'xpath-text', family: 'XPath', label: 'Text match',
    tier: 6, kind: 'medium', nav: 'nameplate',
    syntax: 'xpath///button[text()="Submit"]',
    metaphor: 'Reading the name off the door.',
    detail: 'Anchored to visible text — a copy edit or translation breaks it.',
  },
  {
    id: 'aria-implicit', family: 'ARIA', label: 'Role + visible text',
    tier: 7, kind: 'medium', nav: 'beam',
    syntax: 'aria/Submit[role="button"]',
    metaphor: 'Air ID off a sign that gets repainted.',
    detail: 'Name taken from visible text — a copy edit renames it.',
  },

  // ---- strong ----
  {
    id: 'aria-explicit', family: 'ARIA', label: 'Role + aria-label',
    tier: 8, kind: 'strong', nav: 'beam',
    syntax: 'aria/Submit form[role="button"]',
    metaphor: "Air ID by the building's registered name.",
    detail: 'Name set via aria-label — stable, and tests a11y too.',
  },
  {
    id: 'css-id', family: 'CSS', label: 'Id',
    tier: 9, kind: 'strong', nav: 'pin',
    syntax: '#submit-btn',
    metaphor: "The house's own street number.",
    detail: 'Strong — but only when the id is unique and not auto-generated.',
  },
  {
    id: 'xpath-attr', family: 'XPath', label: 'Attribute path',
    tier: 10, kind: 'strong', nav: 'pin',
    syntax: 'xpath///*[@id="submit-btn"]',
    metaphor: 'Found by number, from anywhere in the city.',
    detail: 'XPath anchored to a stable attribute, not a path.',
  },
  {
    id: 'css-testid', family: 'CSS', label: 'Test id',
    tier: 11, kind: 'strongest', nav: 'pin',
    syntax: '[data-testid="signup-submit"]',
    metaphor: 'A GPS pin placed just for couriers.',
    detail: 'A purpose-built attribute that exists only for tests.',
  },
]

export const SELECTOR_FAMILIES = ['ARIA', 'CSS', 'XPath']

// The city-change events the simulator can trigger. Each breaks a different
// kind of selector — see the header note above.
export const CITY_EVENTS = [
  {
    id: 'insert-house', label: 'Build a new house', icon: '➕',
    blurb: 'Inserts a new element into the form.',
  },
  {
    id: 'repaint', label: 'Repaint the city', icon: '🎨',
    blurb: 'A rebrand renames the element classes.',
  },
  {
    id: 'rename-street', label: 'Rename the street', icon: '🪧',
    blurb: "Renames the form's wrapper class.",
  },
  {
    id: 'residents-move', label: 'Change the nameplate', icon: '✉️',
    blurb: "Rewrites the button's visible text.",
  },
  {
    id: 'refactor-district', label: 'Refactor the district', icon: '🏗️',
    blurb: 'Re-nests and restructures the form markup.',
  },
]

export const KIND_META = {
  weak: { label: 'Weak', color: '#ff5d6c' },
  medium: { label: 'Medium', color: '#ffb547' },
  strong: { label: 'Strong', color: '#00ffc6' },
  strongest: { label: 'Strongest', color: '#8d6bff' },
}
