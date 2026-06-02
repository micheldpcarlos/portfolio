<script setup>
import { watch, onUnmounted } from 'vue'
import { state, dismissToast } from './store.js'

const timers = new Map()

watch(
  () => state.toasts.map((t) => t.id),
  (ids) => {
    for (const id of ids) {
      if (!timers.has(id)) {
        const handle = setTimeout(() => {
          dismissToast(id)
          timers.delete(id)
        }, 3200)
        timers.set(id, handle)
      }
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  for (const h of timers.values()) clearTimeout(h)
  timers.clear()
})

const icon = (kind) =>
  kind === 'success' ? '✓' : kind === 'error' ? '✕' : 'ℹ'
</script>

<template>
  <div class="nb-toasts" data-testid="toast-host" aria-live="polite">
    <transition-group name="nb-toast">
      <div
        v-for="t in state.toasts"
        :key="t.id"
        class="nb-toast"
        :class="`is-${t.kind}`"
        :data-testid="`toast-${t.kind}`"
        role="status"
      >
        <span class="nb-toast-icon" aria-hidden="true">{{ icon(t.kind) }}</span>
        <span class="nb-toast-msg">{{ t.message }}</span>
        <button
          class="nb-toast-x"
          type="button"
          aria-label="Dismiss notification"
          @click="dismissToast(t.id)"
        >
          ×
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.nb-toasts {
  position: fixed;
  bottom: 22px;
  right: 22px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}
.nb-toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 240px;
  max-width: 360px;
  padding: 11px 12px 11px 14px;
  border-radius: 12px;
  background: #1b1b27;
  border: 1px solid #2c2c3a;
  color: #e8e8ee;
  box-shadow: 0 18px 40px -20px rgba(0, 0, 0, 0.8);
  font-size: 0.88rem;
}
.nb-toast.is-success {
  border-color: rgba(0, 209, 132, 0.5);
}
.nb-toast.is-error {
  border-color: rgba(255, 92, 122, 0.5);
}
.nb-toast-icon {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  flex: none;
  background: #2a2a3a;
}
.is-success .nb-toast-icon {
  background: rgba(0, 209, 132, 0.18);
  color: #00d184;
}
.is-error .nb-toast-icon {
  background: rgba(255, 92, 122, 0.18);
  color: #ff5c7a;
}
.is-info .nb-toast-icon {
  background: rgba(126, 138, 255, 0.18);
  color: #9aa6ff;
}
.nb-toast-msg {
  flex: 1;
}
.nb-toast-x {
  flex: none;
  background: none;
  border: none;
  color: #75758a;
  font-size: 1.15rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}
.nb-toast-x:hover {
  color: #e8e8ee;
}
.nb-toast-enter-active,
.nb-toast-leave-active {
  transition: all 0.25s ease;
}
.nb-toast-enter-from,
.nb-toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
