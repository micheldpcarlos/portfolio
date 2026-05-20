<script setup>
import { computed } from 'vue'
import { SELECTOR_CATALOG, KIND_META } from './selectorCatalog.js'
import { ROBUSTNESS, MAX_ROBUSTNESS } from './evaluateSelector.js'
import { state, statusMap, survivedCounts, selectSelector } from './cityStore.js'

// Strongest at the top of the ladder, weakest at the bottom.
const rungs = computed(() =>
  [...SELECTOR_CATALOG].sort((a, b) => b.tier - a.tier),
)

const hasEvents = computed(() => state.triggeredEvents.length > 0)
const pips = MAX_ROBUSTNESS
</script>

<template>
  <section class="sc-ladder" aria-labelledby="sc-ladder-title">
    <header class="sc-ladder-head">
      <h2 id="sc-ladder-title">The selector strength ladder</h2>
      <p>
        Robustness = how many of the five city changes a selector survives on its
        own. Climb from the fragile rungs at the bottom to the dependable ones on
        top.
      </p>
    </header>

    <ol class="sc-ladder-list">
      <li
        v-for="sel in rungs"
        :key="sel.id"
        class="sc-rung"
        :class="{
          'is-selected': state.selectedSelectorId === sel.id,
          'is-broke': hasEvents && statusMap[sel.id].broke,
        }"
        :style="{ '--kind': KIND_META[sel.kind].color }"
      >
        <button type="button" class="sc-rung-btn" @click="selectSelector(sel.id)">
          <span class="sc-rung-kind">{{ KIND_META[sel.kind].label }}</span>

          <span class="sc-rung-main">
            <span class="sc-rung-label">{{ sel.label }}</span>
            <code class="sc-rung-syntax">{{ sel.syntax }}</code>
          </span>

          <span class="sc-rung-meter" :aria-label="`Survives ${ROBUSTNESS[sel.id]} of ${pips} city changes`">
            <span
              v-for="n in pips"
              :key="n"
              class="sc-pip"
              :class="{ 'is-on': n <= ROBUSTNESS[sel.id] }"
            />
            <span class="sc-rung-score">{{ ROBUSTNESS[sel.id] }}/{{ pips }}</span>
          </span>

          <span class="sc-rung-status">
            <span v-if="!hasEvents" class="sc-rung-idle">—</span>
            <span
              v-else
              class="sc-rung-dot"
              :class="statusMap[sel.id].broke ? 'is-broke' : 'is-found'"
            >
              <span aria-hidden="true">{{ statusMap[sel.id].broke ? '✕' : '✓' }}</span>
              <span class="sc-rung-survived">
                {{ survivedCounts[sel.id].survived }}/{{ survivedCounts[sel.id].total }}
              </span>
            </span>
          </span>
        </button>
      </li>
    </ol>

    <p class="sc-ladder-foot">
      <strong>Takeaway:</strong> position and shape change constantly — paint and
      copy change often — but a role, a unique id or a
      <code>data-testid</code> is a promise. Address your elements by intent, not
      by accident.
    </p>
  </section>
</template>

<style scoped>
.sc-ladder {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid #2c2c38;
  background: #161620;
}

.sc-ladder-head h2 {
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f5f5f7;
}

.sc-ladder-head p {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.5;
  color: #9a9aac;
}

.sc-ladder-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
  counter-reset: rung;
}

.sc-rung {
  border-radius: 12px;
  border: 1px solid #2c2c38;
  border-left: 4px solid var(--kind);
  background: #1a1a22;
  transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.24s ease;
}

.sc-rung.is-selected {
  box-shadow: 0 0 0 1px var(--kind), 0 14px 28px -18px var(--kind);
}

.sc-rung.is-broke {
  border-left-color: #ff5d6c;
  animation: sc-break-flash 0.7s ease-out;
}

@keyframes sc-break-flash {
  0% { background: #2c1820; }
  100% { background: #1a1a22; }
}

.sc-rung-btn {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 11px 14px;
  background: none;
  border: none;
  color: #e8e8ee;
  cursor: pointer;
  text-align: left;
}

.sc-rung-btn:focus-visible {
  outline: 3px solid var(--kind);
  outline-offset: -2px;
  border-radius: 10px;
}

.sc-rung-kind {
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--kind);
}

.sc-rung-main {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.sc-rung-label {
  font-size: 0.96rem;
  font-weight: 700;
}

.sc-rung-syntax {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.74rem;
  color: #8d8d9e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sc-rung-meter {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sc-pip {
  width: 13px;
  height: 8px;
  border-radius: 3px;
  background: #2f2f3c;
}

.sc-pip.is-on {
  background: var(--kind);
}

.sc-rung-score {
  margin-left: 4px;
  font-size: 0.74rem;
  font-weight: 700;
  color: #9a9aac;
  font-variant-numeric: tabular-nums;
}

.sc-rung-status {
  display: flex;
  justify-content: flex-end;
  min-width: 58px;
}

.sc-rung-idle {
  color: #55556a;
}

.sc-rung-dot {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
}

.sc-rung-dot.is-found {
  color: #0c1a12;
  background: #35d29a;
}

.sc-rung-dot.is-broke {
  color: #25090d;
  background: #ff5d6c;
}

.sc-rung-survived {
  font-variant-numeric: tabular-nums;
}

.sc-ladder-foot {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.55;
  color: #b9b9c8;
  border-top: 1px solid #2c2c38;
  padding-top: 12px;
}

.sc-ladder-foot code {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.82rem;
  color: #8d6bff;
  background: #0f0f14;
  padding: 1px 5px;
  border-radius: 5px;
  white-space: nowrap;
}

@media (max-width: 620px) {
  .sc-rung-btn {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "kind status"
      "main main"
      "meter meter";
    gap: 8px;
  }
  .sc-rung-kind { grid-area: kind; }
  .sc-rung-status { grid-area: status; }
  .sc-rung-main { grid-area: main; }
  .sc-rung-meter { grid-area: meter; }
}
</style>
