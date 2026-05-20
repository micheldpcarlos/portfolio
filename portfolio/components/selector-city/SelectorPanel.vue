<script setup>
import { SELECTOR_CATALOG } from './selectorCatalog.js'
import SelectorCard from './SelectorCard.vue'

defineProps({
  // When set (desktop), the panel is locked to this pixel height — matched to
  // the city map — and the cards scroll inside it.
  panelHeight: { type: Number, default: null },
})
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
        Nine ways to address one house. Pick one to watch the courier search the
        map — then trigger city changes and see which addresses survive.
      </p>
    </header>

    <div class="sc-panel-grid">
      <SelectorCard
        v-for="selector in SELECTOR_CATALOG"
        :key="selector.id"
        :selector="selector"
      />
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
  font-size: 0.86rem;
  line-height: 1.5;
  color: #9a9aac;
}

.sc-panel-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

@media (min-width: 540px) and (max-width: 1023px) {
  .sc-panel-grid {
    grid-template-columns: 1fr 1fr;
  }
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
