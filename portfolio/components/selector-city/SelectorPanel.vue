<script setup>
import { SELECTOR_CATALOG, SELECTOR_FAMILIES } from './selectorCatalog.js'
import SelectorCard from './SelectorCard.vue'

defineProps({
  // When set (desktop), the panel is locked to this pixel height — matched to
  // the city map — and the cards scroll inside it.
  panelHeight: { type: Number, default: null },
})

const groups = SELECTOR_FAMILIES.map((family) => ({
  family,
  selectors: SELECTOR_CATALOG.filter((s) => s.family === family),
}))
</script>

<template>
  <section
    class="sc-panel"
    :class="{ 'is-fixed': panelHeight }"
    :style="panelHeight ? { height: panelHeight + 'px' } : null"
    aria-labelledby="sc-panel-title"
  >
    <header class="sc-panel-head">
      <h2 id="sc-panel-title">The address book</h2>
      <p>
        Three selector families — each in a weak and a strong form. Pick one to
        watch the courier search; then trigger city changes to see what survives.
      </p>
    </header>

    <div class="sc-panel-grid">
      <template v-for="group in groups" :key="group.family">
        <h3 class="sc-family-head">{{ group.family }}</h3>
        <SelectorCard
          v-for="selector in group.selectors"
          :key="selector.id"
          :selector="selector"
        />
      </template>
    </div>
  </section>
</template>

<style scoped>
.sc-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sc-panel-head {
  flex-shrink: 0;
}

.sc-panel-head h2 {
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f5f5f7;
}

.sc-panel-head p {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.45;
  color: #9a9aac;
}

.sc-panel-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
}

.sc-family-head {
  margin: 6px 0 0;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #75758a;
  padding-bottom: 5px;
  border-bottom: 1px solid #2c2c38;
}

.sc-family-head:first-child {
  margin-top: 0;
}

/* Fixed-height panel (desktop): cards scroll, height tracks the city map. */
.sc-panel.is-fixed .sc-panel-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding: 3px 8px 6px 0;
  scrollbar-width: thin;
  scrollbar-color: #34343f transparent;
}

.sc-panel.is-fixed .sc-panel-grid::-webkit-scrollbar {
  width: 9px;
}

.sc-panel.is-fixed .sc-panel-grid::-webkit-scrollbar-track {
  background: transparent;
}

.sc-panel.is-fixed .sc-panel-grid::-webkit-scrollbar-thumb {
  background: #34343f;
  border-radius: 9px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.sc-panel.is-fixed .sc-panel-grid::-webkit-scrollbar-thumb:hover {
  background: #44444f;
  background-clip: padding-box;
}
</style>
