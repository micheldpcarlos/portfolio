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

const swipeCards = ref([
  { id: 'sc-1', title: 'Sunset Vibes', body: 'Swipe me left or right.', color: '#ff7a59' },
  { id: 'sc-2', title: 'Aurora', body: 'Drag me with your mouse or finger.', color: '#00ffc6' },
  { id: 'sc-3', title: 'Neon Pulse', body: 'Past 120px triggers a dismiss.', color: '#ff2d95' },
  { id: 'sc-4', title: 'Deep Sea', body: 'Use the buttons too — keyboard friendly.', color: '#4f8cff' },
  { id: 'sc-5', title: 'Lava Flow', body: 'Reset to bring them all back.', color: '#ffb547' },
])
const swipeLog = ref([])
const dragId = ref(null)
const dragStartX = ref(0)
const dragOffset = ref(0)
const dragging = ref(false)
const SWIPE_THRESHOLD = 120

const topCardId = () => swipeCards.value[swipeCards.value.length - 1]?.id

const onPointerDown = (e, card) => {
  if (card.id !== topCardId()) return
  dragId.value = card.id
  dragStartX.value = e.clientX
  dragOffset.value = 0
  dragging.value = true
  e.currentTarget.setPointerCapture?.(e.pointerId)
}

const onPointerMove = (e) => {
  if (!dragging.value) return
  dragOffset.value = e.clientX - dragStartX.value
}

const dismissCard = (id, direction) => {
  const card = swipeCards.value.find((c) => c.id === id)
  if (!card) return
  swipeLog.value = [
    { id, title: card.title, direction, at: new Date().toLocaleTimeString() },
    ...swipeLog.value,
  ].slice(0, 6)
  swipeCards.value = swipeCards.value.filter((c) => c.id !== id)
}

const onPointerUp = () => {
  if (!dragging.value) return
  const id = dragId.value
  const offset = dragOffset.value
  dragging.value = false
  dragId.value = null
  dragStartX.value = 0
  dragOffset.value = 0
  if (Math.abs(offset) > SWIPE_THRESHOLD) {
    dismissCard(id, offset > 0 ? 'right' : 'left')
  }
}

// Touch handlers run alongside the pointer handlers so synthetic touch
// gestures (e.g. CDP Input.dispatchTouchEvent) reach the carousel even when
// Chrome doesn't translate them into pointer events. For real mouse/pen
// gestures only the pointer handlers fire; for real finger touch both fire
// and converge on the same state (idempotent).
const onTouchStart = (e, card) => {
  if (card.id !== topCardId()) return
  const t = e.touches && e.touches[0]
  if (!t) return
  dragId.value = card.id
  dragStartX.value = t.clientX
  dragOffset.value = 0
  dragging.value = true
}

const onTouchMove = (e) => {
  if (!dragging.value) return
  const t = e.touches && e.touches[0]
  if (!t) return
  dragOffset.value = t.clientX - dragStartX.value
}

const onTouchEnd = () => onPointerUp()

const swipeProgrammatic = (direction) => {
  const id = topCardId()
  if (!id) return
  dismissCard(id, direction)
}

const resetSwipeDeck = () => {
  swipeCards.value = [
    { id: 'sc-1', title: 'Sunset Vibes', body: 'Swipe me left or right.', color: '#ff7a59' },
    { id: 'sc-2', title: 'Aurora', body: 'Drag me with your mouse or finger.', color: '#00ffc6' },
    { id: 'sc-3', title: 'Neon Pulse', body: 'Past 120px triggers a dismiss.', color: '#ff2d95' },
    { id: 'sc-4', title: 'Deep Sea', body: 'Use the buttons too — keyboard friendly.', color: '#4f8cff' },
    { id: 'sc-5', title: 'Lava Flow', body: 'Reset to bring them all back.', color: '#ffb547' },
  ]
  swipeLog.value = []
}

const cardStyle = (card, index, total) => {
  const isTop = card.id === topCardId()
  const depth = total - 1 - index
  const baseScale = 1 - depth * 0.04
  const baseTranslateY = depth * 10
  if (isTop && dragging.value) {
    const rotate = dragOffset.value / 20
    return {
      transform: `translate(calc(-50% + ${dragOffset.value}px), -50%) rotate(${rotate}deg) scale(${baseScale})`,
      transition: 'none',
      zIndex: 100 + index,
    }
  }
  return {
    transform: `translate(-50%, calc(-50% + ${baseTranslateY}px)) scale(${baseScale})`,
    zIndex: 100 + index,
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

  <section class="swipe-section" data-testid="swipe-section">
    <h2>Swipeable cards</h2>
    <p class="hint">Drag the top card left or right. Past 120px it dismisses. Touch, mouse, or pen all work.</p>
    <div class="swipe-stage" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerUp" @pointerleave="onPointerUp" @touchmove="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
      <div v-if="!swipeCards.length" class="swipe-empty" data-testid="swipe-empty">No more cards. Hit reset to bring them back.</div>
      <div v-for="(card, index) in swipeCards" :key="card.id" class="swipe-card" :class="{ top: card.id === topCardId(), dragging: card.id === dragId && dragging }" :style="{ ...cardStyle(card, index, swipeCards.length), background: card.color }" :data-testid="`swipe-card-${card.id}`" @pointerdown="(e) => onPointerDown(e, card)" @touchstart="(e) => onTouchStart(e, card)" @mouseenter="cursorActive = true" @mouseleave="cursorActive = false">
        <div class="swipe-card-inner">
          <h3>{{ card.title }}</h3>
          <p>{{ card.body }}</p>
        </div>
      </div>
    </div>
    <div class="swipe-actions">
      <button type="button" class="swipe-btn left" data-testid="swipe-left" :disabled="!swipeCards.length" @click="swipeProgrammatic('left')" @mouseenter="cursorActive = true" @mouseleave="cursorActive = false">← Swipe left</button>
      <button type="button" class="swipe-btn reset" data-testid="swipe-reset" @click="resetSwipeDeck" @mouseenter="cursorActive = true" @mouseleave="cursorActive = false">Reset</button>
      <button type="button" class="swipe-btn right" data-testid="swipe-right" :disabled="!swipeCards.length" @click="swipeProgrammatic('right')" @mouseenter="cursorActive = true" @mouseleave="cursorActive = false">Swipe right →</button>
    </div>
    <ul v-if="swipeLog.length" class="swipe-log" data-testid="swipe-log">
      <li v-for="entry in swipeLog" :key="`${entry.id}-${entry.at}`"><strong>{{ entry.title }}</strong> swiped <span :class="`dir-${entry.direction}`">{{ entry.direction }}</span> at {{ entry.at }}</li>
    </ul>
  </section>

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

.swipe-section {
  max-width: 720px;
  margin: 0 auto 64px;
  text-align: center;
}

.swipe-section h2 {
  font-size: 1.4rem;
  margin: 0 0 8px;
  color: #f5f5f7;
}

.swipe-stage {
  position: relative;
  height: 340px;
  margin: 28px auto 24px;
  max-width: 360px;
  touch-action: none;
  user-select: none;
}

.swipe-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  border: 2px dashed #2a2a35;
  border-radius: 16px;
}

.swipe-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 320px;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
  color: #0f0f14;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}

.swipe-card.top {
  cursor: grab;
}

.swipe-card.top.dragging {
  cursor: grabbing;
}

.swipe-card-inner {
  position: absolute;
  inset: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  text-align: left;
}

.swipe-card-inner h3 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
}

.swipe-card-inner p {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.85;
}

.swipe-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.swipe-btn {
  padding: 10px 18px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  border: 2px solid #2a2a35;
  background: #1c1c24;
  color: #f5f5f7;
  outline: none;
  transition: border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.swipe-btn:disabled {
  opacity: 0.4;
}

.swipe-btn.left:hover:not(:disabled),
.swipe-btn.left:focus:not(:disabled) {
  border-color: #ff7a59;
  color: #ff7a59;
  box-shadow: 0 0 24px rgba(255, 122, 89, 0.4);
}

.swipe-btn.right:hover:not(:disabled),
.swipe-btn.right:focus:not(:disabled) {
  border-color: #00ffc6;
  color: #00ffc6;
  box-shadow: 0 0 24px rgba(0, 255, 198, 0.4);
}

.swipe-btn.reset:hover,
.swipe-btn.reset:focus {
  border-color: #ff2d95;
  color: #ff2d95;
  box-shadow: 0 0 24px rgba(255, 45, 149, 0.4);
}

.swipe-log {
  margin: 20px auto 0;
  padding: 14px;
  list-style: none;
  background: #1c1c24;
  border: 1px solid #2a2a35;
  border-radius: 8px;
  color: #a1a1aa;
  font-size: 0.85rem;
  text-align: left;
  max-width: 420px;
}

.swipe-log li {
  padding: 4px 0;
}

.swipe-log strong {
  color: #f5f5f7;
}

.dir-left {
  color: #ff7a59;
  font-weight: 600;
}

.dir-right {
  color: #00ffc6;
  font-weight: 600;
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
