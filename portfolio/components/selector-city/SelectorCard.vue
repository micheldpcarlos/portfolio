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
const kindMeta = computed(() => KIND_META[props.selector.kind])
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
    :style="{ '--kind': kindMeta.color }"
    :aria-pressed="selected"
    @click="selectSelector(selector.id)"
  >
    <span class="sc-card-head">
      <span class="sc-card-label">{{ selector.label }}</span>
      <span class="sc-card-tags">
        <span class="sc-card-kind">{{ kindMeta.label }}</span>
        <span class="sc-card-family">{{ selector.family }}</span>
      </span>
    </span>

    <code class="sc-card-syntax">{{ selector.syntax }}</code>

    <span class="sc-card-metaphor">{{ selector.metaphor }}</span>

    <span
      v-if="hasEvents"
      class="sc-card-status"
      :class="status.broke ? 'is-broke' : 'is-found'"
    >
      <span class="sc-card-status-icon" aria-hidden="true">
        {{ status.broke ? '✕' : '✓' }}
      </span>
      <span>{{ status.reason }}</span>
    </span>

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
  gap: 7px;
  width: 100%;
  min-width: 0;
  text-align: left;
  padding: 12px 13px 11px;
  border-radius: 13px;
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
  box-shadow: 0 0 0 1px var(--kind), 0 14px 28px -18px var(--kind);
}

.sc-card.is-broke {
  border-left-color: #ff5d6c;
}

.sc-card.is-found {
  border-left-color: #35d29a;
}

.sc-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.sc-card-label {
  font-size: 0.97rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sc-card-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.sc-card-kind {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #14141a;
  background: var(--kind);
  border-radius: 999px;
  padding: 2px 7px;
}

.sc-card-family {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9a9aac;
  border: 1px solid #3a3a48;
  border-radius: 999px;
  padding: 2px 7px;
}

.sc-card-syntax {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.78rem;
  color: #cfd2dc;
  background: #0f0f14;
  border: 1px solid #2c2c38;
  border-radius: 8px;
  padding: 6px 9px;
  min-width: 0;
  overflow-x: auto;
  white-space: nowrap;
}

.sc-card-metaphor {
  font-size: 0.8rem;
  line-height: 1.35;
  color: #9a9aac;
}

.sc-card-status {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.79rem;
  line-height: 1.35;
  font-weight: 600;
}

.sc-card-status.is-found {
  color: #6fe3b8;
}

.sc-card-status.is-broke {
  color: #ff8f99;
}

.sc-card-status-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 900;
  color: #14141a;
}

.sc-card-status.is-found .sc-card-status-icon {
  background: #35d29a;
}

.sc-card-status.is-broke .sc-card-status-icon {
  background: #ff5d6c;
}

.sc-card-detail {
  font-size: 0.78rem;
  line-height: 1.4;
  color: #b9b9ff;
  border-top: 1px dashed #38384a;
  padding-top: 7px;
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
