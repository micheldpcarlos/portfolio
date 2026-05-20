<script setup>
import { CITY_EVENTS } from './selectorCatalog.js'
import { state, eventCounts, applyCityEvent, resetCity } from './cityStore.js'
</script>

<template>
  <section class="sc-events" aria-labelledby="sc-events-title">
    <div class="sc-events-head">
      <div>
        <h2 id="sc-events-title">City change simulator</h2>
        <p>
          Real apps never sit still. Trigger a change and watch every address in
          the book re-check itself — in any order you like.
        </p>
      </div>
      <button
        type="button"
        class="sc-reset"
        :disabled="state.triggeredEvents.length === 0"
        @click="resetCity()"
      >
        ↺ Rebuild the city
      </button>
    </div>

    <div class="sc-events-grid">
      <button
        v-for="ev in CITY_EVENTS"
        :key="ev.id"
        type="button"
        class="sc-event-btn"
        :class="{ 'is-fired': eventCounts[ev.id] }"
        @click="applyCityEvent(ev.id)"
      >
        <span class="sc-event-icon" aria-hidden="true">{{ ev.icon }}</span>
        <span class="sc-event-text">
          <span class="sc-event-label">{{ ev.label }}</span>
          <span class="sc-event-blurb">{{ ev.blurb }}</span>
        </span>
        <span v-if="eventCounts[ev.id]" class="sc-event-count">
          ×{{ eventCounts[ev.id] }}
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.sc-events {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid #2c2c38;
  background: linear-gradient(160deg, #1c1722, #161620);
}

.sc-events-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.sc-events-head h2 {
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f5f5f7;
}

.sc-events-head p {
  margin: 0;
  max-width: 52ch;
  font-size: 0.86rem;
  line-height: 1.5;
  color: #9a9aac;
}

.sc-reset {
  flex-shrink: 0;
  padding: 9px 15px;
  border-radius: 999px;
  border: 1px solid #3a3a48;
  background: #20202b;
  color: #e8e8ee;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.sc-reset:hover:not(:disabled) {
  background: #2a2a38;
  border-color: #ff2d95;
  transform: translateY(-2px);
}

.sc-reset:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.sc-reset:focus-visible {
  outline: 3px solid #ff2d95;
  outline-offset: 3px;
}

.sc-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 10px;
}

.sc-event-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 13px;
  border-radius: 13px;
  border: 1px solid #2c2c38;
  background: #15151c;
  color: #e8e8ee;
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 0.24s ease-out,
    background 0.24s ease-out;
}

.sc-event-btn:hover {
  transform: translateY(-3px);
  border-color: #ff7a59;
  background: #211a18;
}

.sc-event-btn:focus-visible {
  outline: 3px solid #ff7a59;
  outline-offset: 3px;
}

.sc-event-btn.is-fired {
  border-color: #4f8cff66;
}

.sc-event-icon {
  font-size: 1.3rem;
  line-height: 1;
  flex-shrink: 0;
}

.sc-event-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.sc-event-label {
  font-size: 0.88rem;
  font-weight: 700;
}

.sc-event-blurb {
  font-size: 0.74rem;
  line-height: 1.35;
  color: #8d8d9e;
}

.sc-event-count {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  padding: 0 5px;
  border-radius: 999px;
  background: #4f8cff;
  color: #06122b;
  font-size: 0.72rem;
  font-weight: 800;
}
</style>
