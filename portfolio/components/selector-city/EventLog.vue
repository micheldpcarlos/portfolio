<script setup>
import { state } from './cityStore.js'
</script>

<template>
  <section class="sc-log" aria-labelledby="sc-log-title">
    <h2 id="sc-log-title">City history</h2>
    <p v-if="state.triggeredEvents.length === 0" class="sc-log-empty">
      No changes yet. The city is in its original state — every selector finds
      the house.
    </p>
    <TransitionGroup v-else tag="ol" name="sc-log" class="sc-log-list">
      <li v-for="(ev, i) in state.triggeredEvents" :key="ev.at + '-' + i" class="sc-log-item">
        <span class="sc-log-icon" aria-hidden="true">{{ ev.icon }}</span>
        <span class="sc-log-label">{{ ev.label }}</span>
        <span class="sc-log-time">{{ ev.at }}</span>
      </li>
    </TransitionGroup>
  </section>
</template>

<style scoped>
.sc-log {
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid #2c2c38;
  background: #1a1a22;
}

.sc-log h2 {
  margin: 0 0 10px;
  font-size: 1rem;
  font-weight: 700;
  color: #f5f5f7;
}

.sc-log-empty {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.5;
  color: #9a9aac;
}

.sc-log-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sc-log-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 9px;
  background: #15151c;
  border: 1px solid #26262f;
  font-size: 0.83rem;
}

.sc-log-icon {
  font-size: 1rem;
}

.sc-log-label {
  flex: 1;
  font-weight: 600;
  color: #e8e8ee;
}

.sc-log-time {
  font-size: 0.72rem;
  color: #75758a;
  font-variant-numeric: tabular-nums;
}

.sc-log-enter-active {
  transition: opacity 0.3s ease-out, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.sc-log-enter-from {
  opacity: 0;
  transform: translateX(-14px);
}

.sc-log-move {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
</style>
