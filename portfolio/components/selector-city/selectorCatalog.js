// selectorCatalog.js
// Every selector type, ordered weak -> strong. `nav` picks which map animation
// plays when the card is selected. `kind` drives the strength colour band.

export const SELECTOR_CATALOG = [
  {
    id: 'xpath-abs', label: 'Absolute XPath', api: 'XPath',
    tier: 1, kind: 'weak', nav: 'route',
    syntax: '/html/body/form/div[3]',
    metaphor: 'Turn-by-turn directions counted from the city gate.',
    detail:
      'Counts every turn from the root. Insert one building and every direction ' +
      'after it points at the wrong door.',
  },
  {
    id: 'nth-child', label: ':nth-child()', api: 'CSS',
    tier: 2, kind: 'weak', nav: 'route',
    syntax: 'form > *:nth-child(3)',
    metaphor: '"The 3rd house on Maple Street" — pure counting.',
    detail:
      'Position-based. Re-order the street or insert a sibling and the count ' +
      'no longer lands on your house.',
  },
  {
    id: 'structure', label: 'Tag / structure', api: 'CSS',
    tier: 3, kind: 'weak', nav: 'route',
    syntax: 'form div button',
    metaphor: 'Describing the block shape and the building types.',
    detail:
      'Survives counting changes, but a DOM refactor reshapes the block and ' +
      'the description stops matching.',
  },
  {
    id: 'class', label: 'Class', api: 'CSS',
    tier: 4, kind: 'medium', nav: 'scan',
    syntax: '.btn-primary',
    metaphor: 'The paint colour — "the blue house".',
    detail:
      'Fine until a rebrand repaints the city, or another house is painted ' +
      'the same colour and the match turns ambiguous.',
  },
  {
    id: 'scoped-css', label: 'Scoped CSS', api: 'CSS',
    tier: 5, kind: 'strong', nav: 'landmark',
    syntax: '.signup-form button[type="submit"]',
    metaphor: 'A named street plus a local attribute — a stable landmark.',
    detail:
      'Robust against repaints and inserts — but tied to the street name. ' +
      'Rename the street and the landmark is gone.',
  },
  {
    id: 'text', label: 'getByText', api: 'Playwright',
    tier: 6, kind: 'strong', nav: 'nameplate',
    syntax: 'getByText("Submit")',
    metaphor: 'The family nameplate on the mailbox.',
    detail:
      'Readable and intuitive — but the nameplate changes with every copy ' +
      'edit or translation.',
  },
  {
    id: 'aria', label: 'getByRole', api: 'Playwright',
    tier: 7, kind: 'strong', nav: 'beam',
    syntax: 'getByRole("button", { name: "Submit form" })',
    metaphor: 'Air ID — recognised from above by what the building IS.',
    detail:
      'Identifies by role plus accessible name. Immune to layout, paint and ' +
      'position changes — and it tests accessibility for free.',
  },
  {
    id: 'id', label: '#id', api: 'CSS',
    tier: 8, kind: 'strong', nav: 'pin',
    syntax: '#submit-btn',
    metaphor: 'A globally unique house number.',
    detail:
      'Unbeatable — as long as the id is truly unique on the page and never ' +
      'recycled by a framework.',
  },
  {
    id: 'testid', label: 'data-testid', api: 'CSS',
    tier: 9, kind: 'strongest', nav: 'pin',
    syntax: '[data-testid="signup-submit"]',
    metaphor: 'A GPS pin the city planner placed just for couriers.',
    detail:
      'Purpose-built for tests — decoupled from looks, copy and layout. ' +
      'The gold standard, when the team agrees to place the pins.',
  },
]

// The five "city change" events the simulator can trigger.
export const CITY_EVENTS = [
  {
    id: 'insert-house', label: 'Build a new house', icon: '➕',
    blurb: 'Inserts a new element into the signup form.',
  },
  {
    id: 'repaint', label: 'Repaint the city', icon: '🎨',
    blurb: 'A rebrand renames every class.',
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
    blurb: 'Restructures the whole form markup.',
  },
]

export const KIND_META = {
  weak: { label: 'Weak', color: '#ff5d6c' },
  medium: { label: 'Medium', color: '#ffb547' },
  strong: { label: 'Strong', color: '#00ffc6' },
  strongest: { label: 'Strongest', color: '#8d6bff' },
}
