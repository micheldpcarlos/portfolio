---
title: Hover and Focus Test
description: Test page with a custom cursor and hover/focus reveal items
layout: false
---

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cursorX = ref(0)
const cursorY = ref(0)
const cursorActive = ref(false)
const dropdownOpen = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleDropdownBlur = (event) => {
  const next = event.relatedTarget
  if (!next || !event.currentTarget.contains(next)) {
    dropdownOpen.value = false
  }
}

const items = [
  { id: 1, label: 'Card One', reveal: '✨ Secret message #1' },
  { id: 2, label: 'Card Two', reveal: '🔥 Hot take unlocked' },
  { id: 3, label: 'Card Three', reveal: '🚀 Boom! Revealed' },
  { id: 4, label: 'Card Four', reveal: '🎯 Target acquired' },
  { id: 5, label: 'Hover me (link)', reveal: '🔗 Link hovered' },
  { id: 6, label: 'Focus me (button)', reveal: '⌨️ Button focused' },
]

const handleMove = (e) => {
  cursorX.value = e.clientX
  cursorY.value = e.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', handleMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMove)
})
</script>

<div class="page">
  <div
    class="custom-cursor"
    :class="{ active: cursorActive }"
    :style="{ transform: `translate(${cursorX}px, ${cursorY}px)` }"
    data-testid="custom-cursor"
  ></div>

  <header class="header">
    <h1>Hover & Focus Playground</h1>
    <p>Move your mouse. Hover the cards. Tab through the buttons.</p>
  </header>

  <section class="grid">
    <div
      v-for="item in items.slice(0, 4)"
      :key="item.id"
      class="card"
      tabindex="0"
      :data-testid="`card-${item.id}`"
      @mouseenter="cursorActive = true"
      @mouseleave="cursorActive = false"
      @focus="cursorActive = true"
      @blur="cursorActive = false"
    >
      <span class="card-label">{{ item.label }}</span>
      <span class="card-reveal">{{ item.reveal }}</span>
    </div>
  </section>

  <section class="controls">
    <a
      href="#"
      class="link"
      data-testid="hover-link"
      @mouseenter="cursorActive = true"
      @mouseleave="cursorActive = false"
      @click.prevent
    >
      {{ items[4].label }}
      <span class="tooltip">{{ items[4].reveal }}</span>
    </a>

    <button
      type="button"
      class="button"
      data-testid="focus-button"
      @mouseenter="cursorActive = true"
      @mouseleave="cursorActive = false"
      @focus="cursorActive = true"
      @blur="cursorActive = false"
    >
      {{ items[5].label }}
      <span class="tooltip">{{ items[5].reveal }}</span>
    </button>
  </section>

  <section class="dropdown-section">
    <h2>Dropdown (closes when focus leaves)</h2>
    <div
      class="dropdown"
      data-testid="dropdown"
      @focusout="handleDropdownBlur"
    >
      <button
        type="button"
        class="dropdown-trigger"
        data-testid="dropdown-trigger"
        :aria-expanded="dropdownOpen"
        aria-haspopup="menu"
        @click="toggleDropdown"
        @mouseenter="cursorActive = true"
        @mouseleave="cursorActive = false"
      >
        {{ dropdownOpen ? 'Close menu' : 'Open menu' }}
        <span class="chevron" :class="{ open: dropdownOpen }">▾</span>
      </button>
      <ul
        v-if="dropdownOpen"
        class="dropdown-menu"
        role="menu"
        data-testid="dropdown-menu"
      >
        <li role="none" v-for="n in 4" :key="n">
          <button
            type="button"
            role="menuitem"
            class="dropdown-item"
            :data-testid="`dropdown-item-${n}`"
            @mouseenter="cursorActive = true"
            @mouseleave="cursorActive = false"
          >
            Option {{ n }}
          </button>
        </li>
      </ul>
    </div>
    <p class="hint">Tip: Tab through the items — menu stays open. Tab past the last one (or click outside) — menu closes.</p>
  </section>
</div>

<style scoped>
.page {
  min-height: 100vh;
  padding: 48px 24px 96px;
  background: #0f0f14;
  color: #f5f5f7;
  font-family: system-ui, sans-serif;
  cursor: none;
}

.page * {
  cursor: none;
}

.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  margin: -14px 0 0 -14px;
  border-radius: 50%;
  background: #ff2d95;
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px #ff2d95, 0 0 24px rgba(255, 45, 149, 0.8);
  pointer-events: none;
  z-index: 9999;
  transition: width 0.15s ease, height 0.15s ease, margin 0.15s ease, background 0.15s ease;
  will-change: transform;
}

.custom-cursor.active {
  width: 56px;
  height: 56px;
  margin: -28px 0 0 -28px;
  background: #00ffc6;
  box-shadow: 0 0 0 2px #00ffc6, 0 0 36px rgba(0, 255, 198, 0.9);
}

.header {
  text-align: center;
  margin-bottom: 48px;
}

.header h1 {
  font-size: 2.5rem;
  margin: 0 0 8px;
}

.header p {
  color: #a1a1aa;
  margin: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 960px;
  margin: 0 auto 48px;
}

.card {
  position: relative;
  height: 180px;
  padding: 20px;
  border-radius: 12px;
  background: #1c1c24;
  border: 2px solid #2a2a35;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
  outline: none;
}

.card:hover,
.card:focus {
  transform: translateY(-4px);
  border-color: #ff2d95;
  background: #26202b;
}

.card:focus {
  outline: 3px solid #00ffc6;
  outline-offset: 4px;
}

.card-label {
  font-size: 1.1rem;
  font-weight: 600;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.card-reveal {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #00ffc6;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.25s ease, transform 0.25s ease;
  padding: 16px;
  text-align: center;
}

.card:hover .card-label,
.card:focus .card-label {
  opacity: 0;
  transform: translateY(-8px);
}

.card:hover .card-reveal,
.card:focus .card-reveal {
  opacity: 1;
  transform: scale(1);
}

.controls {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 960px;
  margin: 0 auto;
}

.link,
.button {
  position: relative;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  outline: none;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.link {
  color: #f5f5f7;
  text-decoration: none;
  border: 2px solid #2a2a35;
  background: #1c1c24;
}

.link:focus,
.button:focus {
  outline: 3px solid #00ffc6;
  outline-offset: 4px;
}

.link:hover,
.link:focus {
  color: #00ffc6;
  border-color: #00ffc6;
  box-shadow: 0 0 24px rgba(0, 255, 198, 0.4);
}

.button {
  border: 2px solid #ff2d95;
  background: transparent;
  color: #ff2d95;
}

.button:hover,
.button:focus {
  background: #ff2d95;
  color: #0f0f14;
  box-shadow: 0 0 24px rgba(255, 45, 149, 0.5);
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  padding: 8px 12px;
  background: #f5f5f7;
  color: #0f0f14;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #f5f5f7;
}

.link:hover .tooltip,
.link:focus .tooltip,
.button:hover .tooltip,
.button:focus .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.dropdown-section {
  max-width: 960px;
  margin: 64px auto 0;
  text-align: center;
}

.dropdown-section h2 {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #f5f5f7;
}

.dropdown {
  position: relative;
  display: inline-block;
  text-align: left;
}

.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: #0f0f14;
  background: #00ffc6;
  border: 2px solid #00ffc6;
  border-radius: 8px;
  outline: none;
  transition: box-shadow 0.2s ease, background 0.2s ease;
}

.dropdown-trigger:hover,
.dropdown-trigger:focus {
  box-shadow: 0 0 24px rgba(0, 255, 198, 0.6);
}

.dropdown-trigger:focus {
  outline: 3px solid #ff2d95;
  outline-offset: 4px;
}

.chevron {
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 220px;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #1c1c24;
  border: 2px solid #2a2a35;
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.dropdown-item {
  width: 100%;
  padding: 10px 14px;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #f5f5f7;
  font-size: 0.95rem;
  outline: none;
  transition: background 0.15s ease, color 0.15s ease;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background: #26202b;
  color: #00ffc6;
}

.dropdown-item:focus {
  outline: 2px solid #00ffc6;
  outline-offset: -2px;
}

.hint {
  margin-top: 20px;
  color: #a1a1aa;
  font-size: 0.9rem;
}
</style>
