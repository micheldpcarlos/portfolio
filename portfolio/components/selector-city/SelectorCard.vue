<script setup>
import { computed } from 'vue'
import { state, statusMap, selectSelector } from './cityStore.js'
import { KIND_META } from './selectorCatalog.js'

const props = defineProps({
  selector: { type: Object, required: true },
})

const selected = computed(() => state.selectedSelectorId === props.selector.id)
const hasEvents = computed(() => state.triggeredEvents.length > 0)
const status = computed(() => statusMap.value[props.selector.id])
const kindColor = computed(() => KIND_META[props.selector.kind].color)
</script>

<template>
  <button
    type="button"
    class="sc-card"
    :class="[
      `sc-card--${selector.kind}`,
      {
        'is-selected': selected,
        'is-broke': hasEvents && status.broke,
        'is-found': hasEvents && !status.broke,
      },
    ]"
    :style="{ '--kind': kindColor }"
    :aria-pressed="selected"
    @click="selectSelector(selector.id)"
  >
    <span class="sc-card-head">
      <span class="sc-card-label">{{ selector.label }}</span>
      <span class="sc-card-api">{{ selector.api }}</span>
    </span>

    <code class="sc-card-syntax">{{ selector.syntax }}</code>

    <span class="sc-card-metaphor">{{ selector.metaphor }}</span>

    <span v-if="hasEvents" class="sc-card-status">
      <span class="sc-card-badge" :class="status.broke ? 'is-broke' : 'is-found'">
        <span aria-hidden="true">{{ status.broke ? '✕' : '✓' }}</span>
        {{ status.broke ? 'Lost the house' : 'Still finds it' }}
      </span>
    </span>
    <span v-if="hasEvents" class="sc-card-reason">{{ status.reason }}</span>

    <Transition name="sc-detail">
      <span v-if="selected" class="sc-card-detail">{{ selector.detail }}</span>
    </Transition>
  </button>
</template>

<style scoped>
.sc-card {
  --kind: #888;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
  text-align: left;
  padding: 16px 16px 14px;
  border-radius: 14px;
  border: 1px solid #2c2c38;
  border-left: 4px solid var(--kind);
  background: #1a1a22;
  color: #e8e8ee;
  cursor: pointer;
  transition:
    transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 0.26s ease-out,
    box-shadow 0.26s ease-out,
    background 0.26s ease-out;
}

.sc-card:hover {
  transform: translateY(-3px);
  border-color: var(--kind);
  background: #20202b;
}

.sc-card:focus-visible {
  outline: 3px solid var(--kind);
  outline-offset: 3px;
}

.sc-card.is-selected {
  background: #221d2b;
  border-color: var(--kind);
  box-shadow: 0 0 0 1px var(--kind), 0 16px 32px -18px var(--kind);
}

.sc-card.is-broke {
  border-left-color: #ff5d6c;
}

.sc-card.is-found {
  border-left-color: #35d29a;
}

.sc-card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.sc-card-label {
  font-size: 1.02rem;
  font-weight: 700;
}

.sc-card-api {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--kind);
  border: 1px solid currentColor;
  border-radius: 999px;
  padding: 2px 8px;
}

.sc-card-syntax {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.8rem;
  color: #cfd2dc;
  background: #0f0f14;
  border: 1px solid #2c2c38;
  border-radius: 8px;
  padding: 7px 9px;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
}

.sc-card-metaphor {
  font-size: 0.86rem;
  line-height: 1.45;
  color: #9a9aac;
}

.sc-card-status {
  display: flex;
}

.sc-card-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}

.sc-card-badge.is-found {
  color: #0c1a12;
  background: #35d29a;
}

.sc-card-badge.is-broke {
  color: #25090d;
  background: #ff5d6c;
}

.sc-card-reason {
  font-size: 0.82rem;
  line-height: 1.45;
  color: #c4c4d2;
}

.sc-card-detail {
  font-size: 0.82rem;
  line-height: 1.5;
  color: #b9b9ff;
  border-top: 1px dashed #38384a;
  padding-top: 8px;
}

.sc-detail-enter-active,
.sc-detail-leave-active {
  transition: opacity 0.24s ease-out, transform 0.24s ease-out;
}

.sc-detail-enter-from,
.sc-detail-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
