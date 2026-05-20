// selectorCatalog.js
// Three selector families — CSS (querySelector), XPath and ARIA — each shown
// in weak and strong forms. The lesson: the family doesn't decide strength;
// what the selector is *anchored to* does. Ordered weak -> strong.

export const SELECTOR_CATALOG = [
  // ---- weak ----
  {
    id: 'xpath-abs', family: 'XPath', label: 'Absolute path',
    tier: 1, kind: 'weak', nav: 'route',
    syntax: '/html/body/form/div[3]',
    metaphor: 'Turn-by-turn directions from the gate.',
    detail: 'Anchored to position — anything inserted upstream throws it off.',
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
    id: 'css-class', family: 'CSS', label: 'Class',
    tier: 3, kind: 'medium', nav: 'scan',
    syntax: '.btn-primary',
    metaphor: 'The paint colour of the house.',
    detail: 'Anchored to looks — a rebrand repaints the class away.',
  },
  {
    id: 'aria-implicit', family: 'ARIA', label: 'Role + visible text',
    tier: 4, kind: 'medium', nav: 'beam',
    syntax: 'getByRole("button", { name: "Submit" })',
    metaphor: 'Air ID off a sign that gets repainted.',
    detail: 'Name taken from visible text — a copy edit renames it.',
  },

  // ---- strong ----
  {
    id: 'aria-explicit', family: 'ARIA', label: 'Role + aria-label',
    tier: 5, kind: 'strong', nav: 'beam',
    syntax: 'getByRole("button", { name: "Submit form" })',
    metaphor: "Air ID by the building's registered name.",
    detail: 'Name set via aria-label — stable, and tests a11y too.',
  },
  {
    id: 'xpath-attr', family: 'XPath', label: 'Attribute path',
    tier: 6, kind: 'strong', nav: 'pin',
    syntax: '//button[@id="submit-btn"]',
    metaphor: 'The house with a unique number.',
    detail: 'XPath anchored to a stable attribute, not a path.',
  },
  {
    id: 'css-testid', family: 'CSS', label: 'Test id',
    tier: 7, kind: 'strongest', nav: 'pin',
    syntax: '[data-testid="signup-submit"]',
    metaphor: 'A GPS pin placed just for couriers.',
    detail: 'A purpose-built attribute that exists only for tests.',
  },
]

export const SELECTOR_FAMILIES = ['XPath', 'CSS', 'ARIA']

// The city-change events the simulator can trigger.
export const CITY_EVENTS = [
  {
    id: 'insert-house', label: 'Build a new house', icon: '➕',
    blurb: 'Inserts a new element into the form.',
  },
  {
    id: 'repaint', label: 'Repaint the city', icon: '🎨',
    blurb: 'A rebrand renames every class.',
  },
  {
    id: 'residents-move', label: 'Change the nameplate', icon: '✉️',
    blurb: "Rewrites the button's visible text.",
  },
  {
    id: 'refactor-district', label: 'Refactor the district', icon: '🏗️',
    blurb: 'Restructures the whole form markup.',
  },
]

export const KIND_META = {
  weak: { label: 'Weak', color: '#ff5d6c' },
  medium: { label: 'Medium', color: '#ffb547' },
  strong: { label: 'Strong', color: '#00ffc6' },
  strongest: { label: 'Strongest', color: '#8d6bff' },
}
