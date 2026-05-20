<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { state, statusMap, brokenCount, setReducedMotion } from './cityStore.js'
import { targetHouse } from './cityModel.js'
import { SELECTOR_CATALOG } from './selectorCatalog.js'
import CityEventBar from './CityEventBar.vue'
import CityMap from './CityMap.vue'
import SelectorPanel from './SelectorPanel.vue'
import StrengthLadder from './StrengthLadder.vue'
import EventLog from './EventLog.vue'

const concepts = [
  { a: 'Selector', b: 'an address' },
  { a: 'Browser / test runner', b: 'the courier' },
  { a: 'Element', b: 'a house' },
  { a: 'The DOM', b: 'the city' },
  { a: 'ARIA', b: 'air identification' },
]

const target = computed(() => targetHouse(state.city))
const street = computed(() =>
  state.city.streets.find((s) => s.id === target.value.streetId),
)

const dossier = computed(() => {
  const t = target.value
  const o = state.originalTarget
  const rows = [
    { k: 'tag', cur: `<${t.tag}>`, orig: `<${o.tag}>` },
    { k: 'id', cur: t.idAttr || '—', orig: o.idAttr || '—' },
    { k: 'data-testid', cur: t.testId || '—', orig: o.testId || '—' },
    { k: 'class', cur: t.classes.join(' '), orig: o.classes.join(' ') },
    { k: 'text', cur: t.text || '—', orig: o.text || '—' },
    { k: 'role', cur: t.ariaRole, orig: o.ariaRole },
    { k: 'aria-name', cur: t.ariaName, orig: o.ariaName },
    { k: 'street', cur: '.' + street.value.name, orig: '.' + o.streetName },
    { k: 'nth-child', cur: String(t.lot + 1), orig: String(o.lot + 1) },
    { k: 'DOM path', cur: t.domPath.join(' / '), orig: o.domPath.join(' / ') },
  ]
  return rows.map((r) => ({ ...r, changed: r.cur !== r.orig }))
})

const total = SELECTOR_CATALOG.length

const liveMessage = computed(() => {
  if (state.triggeredEvents.length === 0) return ''
  const last = state.triggeredEvents[0]
  const broke = brokenCount.value
  return `${last.label} applied. ${total - broke} of ${total} selectors still find the element; ${broke} broke.`
})

let cleanup = null
onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  setReducedMotion(mq.matches)
  const handler = (e) => setReducedMotion(e.matches)
  mq.addEventListener('change', handler)
  cleanup = () => mq.removeEventListener('change', handler)
})
onUnmounted(() => {
  if (cleanup) cleanup()
})
</script>

<template>
  <div class="sc-app">
    <div class="sc-shell">
      <header class="sc-hero">
        <p class="sc-eyebrow">A visual guide to selectors</p>
        <h1>Selector City</h1>
        <p class="sc-lede">
          A <strong>selector</strong> is an <strong>address</strong>. The browser
          is a <strong>courier</strong>. Your element is one <strong>house</strong>
          in a city of thousands. A good address still finds the house
          <em>after the city changes</em> — a weak one sends the courier to the
          wrong door.
        </p>

        <ul class="sc-concepts">
          <li v-for="c in concepts" :key="c.a">
            <span class="sc-concept-a">{{ c.a }}</span>
            <span class="sc-concept-arrow" aria-hidden="true">→</span>
            <span class="sc-concept-b">{{ c.b }}</span>
          </li>
        </ul>
      </header>

      <CityEventBar />

      <div class="sc-board">
        <div class="sc-board-left">
          <CityMap />

          <section class="sc-dossier" aria-labelledby="sc-dossier-title">
            <div class="sc-dossier-head">
              <h2 id="sc-dossier-title">The target element — live state</h2>
              <span class="sc-dossier-hint">amber = changed from the original</span>
            </div>
            <dl class="sc-dossier-grid">
              <div
                v-for="row in dossier"
                :key="row.k"
                class="sc-dossier-row"
                :class="{ 'is-changed': row.changed }"
              >
                <dt>{{ row.k }}</dt>
                <dd>
                  <span class="sc-dossier-cur">{{ row.cur }}</span>
                  <span v-if="row.changed" class="sc-dossier-was">
                    was {{ row.orig }}
                  </span>
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div class="sc-board-right">
          <SelectorPanel />
        </div>
      </div>

      <div class="sc-bottom">
        <StrengthLadder />
        <EventLog />
      </div>

      <p class="sc-credit">
        Built with Vue + SVG — pure CSS animation, no libraries. Try toggling
        “reduce motion” in your OS: the lessons hold, the animations step aside.
      </p>
    </div>

    <p class="sc-sr-live" aria-live="polite">{{ liveMessage }}</p>
  </div>
</template>

<style scoped>
.sc-app {
  --bg: #0f0f14;
  width: 100%;
  min-height: 100vh;
  background:
    radial-gradient(1100px 540px at 78% -8%, #221634 0%, transparent 60%),
    radial-gradient(900px 480px at 6% 4%, #11202c 0%, transparent 55%),
    var(--bg);
  color: #e8e8ee;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}

.sc-shell {
  max-width: 1340px;
  margin: 0 auto;
  padding: 48px 24px 36px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ---- hero ---- */
.sc-hero {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sc-eyebrow {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8d6bff;
}

.sc-hero h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.05;
  background: linear-gradient(120deg, #ff2d95, #ffb547 45%, #00ffc6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sc-lede {
  margin: 0;
  max-width: 72ch;
  font-size: 1.02rem;
  line-height: 1.6;
  color: #c4c4d2;
}

.sc-lede strong {
  color: #f5f5f7;
}

.sc-lede em {
  color: #ffb547;
  font-style: normal;
}

.sc-concepts {
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sc-concepts li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #2c2c38;
  background: #1a1a22;
  font-size: 0.8rem;
}

.sc-concept-a {
  color: #9a9aac;
}

.sc-concept-arrow {
  color: #8d6bff;
  font-weight: 800;
}

.sc-concept-b {
  color: #f5f5f7;
  font-weight: 700;
}

/* ---- board ---- */
.sc-board {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.sc-board-left {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.sc-board-right {
  min-width: 0;
}

/* ---- dossier ---- */
.sc-dossier {
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid #2c2c38;
  background: #161620;
}

.sc-dossier-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.sc-dossier-head h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #f5f5f7;
}

.sc-dossier-hint {
  font-size: 0.72rem;
  color: #75758a;
}

.sc-dossier-grid {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 7px;
}

.sc-dossier-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 7px 10px;
  border-radius: 9px;
  background: #0f0f14;
  border: 1px solid #26262f;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.sc-dossier-row.is-changed {
  border-color: #ffb547;
  background: #211c12;
}

.sc-dossier-row dt {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #75758a;
}

.sc-dossier-row dd {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.sc-dossier-cur {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.82rem;
  color: #e8e8ee;
  word-break: break-word;
}

.sc-dossier-row.is-changed .sc-dossier-cur {
  color: #ffce85;
}

.sc-dossier-was {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.72rem;
  color: #75758a;
  text-decoration: line-through;
}

/* ---- bottom ---- */
.sc-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.sc-credit {
  margin: 6px 0 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #75758a;
}

.sc-sr-live {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1023px) {
  .sc-board,
  .sc-bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .sc-shell {
    padding: 32px 14px 28px;
  }
}
</style>
