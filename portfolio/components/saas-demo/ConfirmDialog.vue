<script setup>
import { watch, nextTick, ref } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirm' },
  danger: { type: Boolean, default: false },
})
const emit = defineEmits(['confirm', 'cancel'])

const confirmBtn = ref(null)
watch(
  () => props.open,
  (open) => {
    if (open) nextTick(() => confirmBtn.value?.focus())
  },
)
</script>

<template>
  <transition name="nb-fade">
    <div
      v-if="open"
      class="nb-overlay"
      data-testid="confirm-dialog"
      @click.self="emit('cancel')"
      @keydown.esc="emit('cancel')"
    >
      <div class="nb-confirm" role="alertdialog" aria-modal="true">
        <h3 class="nb-confirm-title">{{ title }}</h3>
        <p v-if="message" class="nb-confirm-msg">{{ message }}</p>
        <div class="nb-confirm-actions">
          <button
            type="button"
            class="nb-btn nb-btn-ghost"
            data-testid="confirm-cancel"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            ref="confirmBtn"
            type="button"
            class="nb-btn"
            :class="danger ? 'nb-btn-danger' : 'nb-btn-primary'"
            data-testid="confirm-ok"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.nb-overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(8, 8, 12, 0.66);
  backdrop-filter: blur(2px);
}
.nb-confirm {
  width: 100%;
  max-width: 400px;
  padding: 22px;
  border-radius: 16px;
  background: #16161f;
  border: 1px solid #2c2c3a;
  box-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.9);
}
.nb-confirm-title {
  margin: 0 0 8px;
  font-size: 1.1rem;
  color: #f5f5f7;
}
.nb-confirm-msg {
  margin: 0 0 18px;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #b6b6c6;
}
.nb-confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.nb-fade-enter-active,
.nb-fade-leave-active {
  transition: opacity 0.18s ease;
}
.nb-fade-enter-from,
.nb-fade-leave-to {
  opacity: 0;
}
</style>
