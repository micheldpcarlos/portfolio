<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  role: { type: String, required: true },
  pair: { type: Array, required: true },
});

const emit = defineEmits(["pick"]);

const winner = ref(null);
const locked = ref(false);

watch(
  () => props.pair,
  () => {
    winner.value = null;
    locked.value = false;
  },
);

function imageUrl(role, seed) {
  return `/team-images/${role}/${seed}.jpg`;
}

function handlePick(seed) {
  if (locked.value) return;
  locked.value = true;
  winner.value = seed;
  setTimeout(() => emit("pick", seed), 380);
}

function state(seed) {
  if (winner.value === null) return "idle";
  return winner.value === seed ? "winner" : "loser";
}
</script>

<template>
  <div class="pair-grid">
    <button
      v-for="seed in pair"
      :key="seed"
      type="button"
      :disabled="locked"
      class="pair-btn"
      :class="`pair-btn--${state(seed)}`"
      @click="handlePick(seed)"
    >
      <img
        :src="imageUrl(role, seed)"
        :alt="`Candidate seed ${seed}`"
        class="pair-img"
        loading="lazy"
      />
      <span class="pair-seed">seed {{ seed }}</span>
      <Transition name="check">
        <span v-if="state(seed) === 'winner'" class="pair-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      </Transition>
    </button>
  </div>
</template>

<style scoped>
.pair-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  width: min(1100px, 100%);
  margin: 0 auto;
}
/* Mobile: cap each stacked image at 38vh wide (aspect-ratio 1:1 keeps it square)
   so both candidates + the progress footer stay visible in the same viewport. */
@media (max-width: 719px) {
  .pair-btn {
    max-width: min(100%, 38vh);
    margin-left: auto;
    margin-right: auto;
  }
}
@media (min-width: 720px) {
  .pair-grid {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }
}

.pair-btn {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 20px;
  border: 2px solid transparent;
  padding: 0;
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition:
    transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 320ms ease-out;
}
.pair-btn:focus-visible {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
}
.pair-btn--idle:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 24px 48px -16px rgba(0, 0, 0, 0.45);
}
.pair-btn--idle:hover .pair-img {
  transform: scale(1.04);
}

.pair-btn--winner {
  transform: scale(1.05);
  border-color: var(--vp-c-brand-1);
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent),
    0 30px 60px -12px color-mix(in srgb, var(--vp-c-brand-1) 50%, transparent);
  z-index: 2;
}
.pair-btn--loser {
  transform: scale(0.9) rotate(1.5deg);
  opacity: 0.3;
  filter: grayscale(1);
}
.pair-btn[disabled] {
  cursor: default;
}

.pair-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.pair-seed {
  position: absolute;
  left: 12px;
  bottom: 12px;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  backdrop-filter: blur(6px);
  letter-spacing: 0.02em;
}

.pair-check {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.pair-check svg {
  width: 96px;
  height: 96px;
  padding: 24px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.55);
}
.check-enter-active {
  transition:
    transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 240ms ease-out;
}
.check-enter-from {
  transform: scale(0.5);
  opacity: 0;
}
.check-enter-to {
  transform: scale(1);
  opacity: 1;
}
</style>
