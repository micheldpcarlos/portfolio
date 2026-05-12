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

const textInput = ref('')
const textareaInput = ref('')
const selectValue = ref('')
const radioValue = ref('')
const checkboxValues = ref([])
const rangeValue = ref(50)
const colorValue = ref('#ff2d95')
const dateValue = ref('')
const submittedSummary = ref('')

const handleFormSubmit = () => {
  submittedSummary.value = JSON.stringify({
    text: textInput.value,
    textarea: textareaInput.value,
    select: selectValue.value,
    radio: radioValue.value,
    checkboxes: checkboxValues.value,
    range: rangeValue.value,
    color: colorValue.value,
    date: dateValue.value,
  }, null, 2)
}

const handleFormReset = () => {
  textInput.value = ''
  textareaInput.value = ''
  selectValue.value = ''
  radioValue.value = ''
  checkboxValues.value = []
  rangeValue.value = 50
  colorValue.value = '#ff2d95'
  dateValue.value = ''
  submittedSummary.value = ''
}

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

  <section class="form-section">
    <h2>Native form elements</h2>
    <p class="hint">Test native interactions: typing, selecting, toggling, sliding, picking dates/colors.</p>
    <form class="form" data-testid="native-form" @submit.prevent="handleFormSubmit" @reset.prevent="handleFormReset" @mouseenter="cursorActive = true" @mouseleave="cursorActive = false">
      <div class="field">
        <label for="text-input">Text input</label>
        <input id="text-input" type="text" v-model="textInput" placeholder="Type something..." data-testid="text-input" />
      </div>
      <div class="field">
        <label for="email-input">Email input</label>
        <input id="email-input" type="email" placeholder="you@example.com" data-testid="email-input" />
      </div>
      <div class="field">
        <label for="password-input">Password</label>
        <input id="password-input" type="password" placeholder="••••••••" data-testid="password-input" />
      </div>
      <div class="field">
        <label for="number-input">Number</label>
        <input id="number-input" type="number" min="0" max="100" step="1" placeholder="0-100" data-testid="number-input" />
      </div>
      <div class="field">
        <label for="textarea">Textarea</label>
        <textarea id="textarea" v-model="textareaInput" rows="4" placeholder="Tell us a story..." data-testid="textarea-input"></textarea>
      </div>
      <div class="field">
        <label for="select">Select</label>
        <select id="select" v-model="selectValue" data-testid="select-input">
          <option value="" disabled>Choose an option</option>
          <option value="alpha">Alpha</option>
          <option value="beta">Beta</option>
          <option value="gamma">Gamma</option>
          <option value="delta">Delta</option>
        </select>
      </div>
      <div class="field">
        <label for="multi-select">Select (multiple)</label>
        <select id="multi-select" multiple size="4" data-testid="multi-select-input">
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="yellow">Yellow</option>
        </select>
      </div>
      <fieldset class="field">
        <legend>Radio group</legend>
        <label class="inline"><input type="radio" name="plan" value="free" v-model="radioValue" data-testid="radio-free" /> Free</label>
        <label class="inline"><input type="radio" name="plan" value="pro" v-model="radioValue" data-testid="radio-pro" /> Pro</label>
        <label class="inline"><input type="radio" name="plan" value="enterprise" v-model="radioValue" data-testid="radio-enterprise" /> Enterprise</label>
      </fieldset>
      <fieldset class="field">
        <legend>Checkboxes</legend>
        <label class="inline"><input type="checkbox" value="news" v-model="checkboxValues" data-testid="checkbox-news" /> Newsletter</label>
        <label class="inline"><input type="checkbox" value="updates" v-model="checkboxValues" data-testid="checkbox-updates" /> Product updates</label>
        <label class="inline"><input type="checkbox" value="offers" v-model="checkboxValues" data-testid="checkbox-offers" /> Special offers</label>
      </fieldset>
      <div class="field">
        <label for="range">Range ({{ rangeValue }})</label>
        <input id="range" type="range" min="0" max="100" v-model.number="rangeValue" data-testid="range-input" />
      </div>
      <div class="field row">
        <div class="field grow">
          <label for="color">Color</label>
          <input id="color" type="color" v-model="colorValue" data-testid="color-input" />
        </div>
        <div class="field grow">
          <label for="date">Date</label>
          <input id="date" type="date" v-model="dateValue" data-testid="date-input" />
        </div>
      </div>
      <div class="field">
        <label for="file">File</label>
        <input id="file" type="file" data-testid="file-input" />
      </div>
      <div class="form-actions">
        <button type="submit" class="button" data-testid="form-submit">Submit</button>
        <button type="reset" class="link" data-testid="form-reset">Reset</button>
      </div>
      <pre v-if="submittedSummary" class="form-summary" data-testid="form-summary">{{ submittedSummary }}</pre>
    </form>
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

.form-section {
  max-width: 640px;
  margin: 64px auto 0;
  text-align: center;
}

.form-section h2 {
  font-size: 1.4rem;
  margin-bottom: 8px;
  color: #f5f5f7;
}

.form {
  margin-top: 24px;
  padding: 28px;
  background: #1c1c24;
  border: 2px solid #2a2a35;
  border-radius: 12px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: none;
  padding: 0;
  margin: 0;
}

.field.row {
  flex-direction: row;
  gap: 18px;
}

.field.grow {
  flex: 1;
}

.field > label,
.field > legend {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f5f5f7;
  padding: 0;
}

.field .inline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
  font-size: 0.95rem;
  color: #f5f5f7;
  font-weight: 400;
}

.form input[type="text"],
.form input[type="email"],
.form input[type="password"],
.form input[type="number"],
.form input[type="date"],
.form textarea,
.form select {
  width: 100%;
  padding: 10px 12px;
  background: #0f0f14;
  color: #f5f5f7;
  border: 2px solid #2a2a35;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form input[type="text"]:hover,
.form input[type="email"]:hover,
.form input[type="password"]:hover,
.form input[type="number"]:hover,
.form input[type="date"]:hover,
.form textarea:hover,
.form select:hover {
  border-color: #ff2d95;
}

.form input[type="text"]:focus,
.form input[type="email"]:focus,
.form input[type="password"]:focus,
.form input[type="number"]:focus,
.form input[type="date"]:focus,
.form textarea:focus,
.form select:focus {
  border-color: #00ffc6;
  box-shadow: 0 0 0 3px rgba(0, 255, 198, 0.25);
}

.form textarea {
  resize: vertical;
  min-height: 88px;
}

.form input[type="range"] {
  width: 100%;
  accent-color: #ff2d95;
}

.form input[type="color"] {
  width: 100%;
  height: 40px;
  padding: 2px;
  background: #0f0f14;
  border: 2px solid #2a2a35;
  border-radius: 8px;
  outline: none;
}

.form input[type="color"]:focus {
  border-color: #00ffc6;
  box-shadow: 0 0 0 3px rgba(0, 255, 198, 0.25);
}

.form input[type="radio"],
.form input[type="checkbox"] {
  accent-color: #00ffc6;
  width: 18px;
  height: 18px;
}

.form input[type="file"] {
  color: #f5f5f7;
  font-family: inherit;
}

.form input[type="file"]::file-selector-button {
  margin-right: 12px;
  padding: 8px 14px;
  background: #00ffc6;
  color: #0f0f14;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-family: inherit;
  transition: background 0.2s ease;
}

.form input[type="file"]::file-selector-button:hover {
  background: #ff2d95;
  color: #f5f5f7;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.form-summary {
  margin: 0;
  padding: 14px;
  background: #0f0f14;
  border: 1px dashed #00ffc6;
  border-radius: 8px;
  color: #00ffc6;
  font-size: 0.85rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: pre-wrap;
  overflow-x: auto;
}
</style>
