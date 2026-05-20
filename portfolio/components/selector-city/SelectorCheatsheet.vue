<script setup>
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const closeBtn = ref(null)

const SHEET = [
  {
    family: 'CSS',
    tag: 'document.querySelector()',
    accent: '#4f8cff',
    blurb:
      'The selectors querySelector understands — the same ones used in ' +
      'stylesheets. Match by type, class, id, attribute, relationship or position.',
    rows: [
      { code: 'tag', desc: 'Every element of that type', ex: 'input' },
      { code: '.class', desc: 'Elements carrying a class', ex: '.btn-primary' },
      { code: '#id', desc: 'The one element with that id', ex: '#email' },
      { code: '[attr]', desc: 'Elements that have an attribute', ex: '[required]' },
      { code: '[attr="val"]', desc: 'An attribute equals a value', ex: '[type="email"]' },
      { code: '[attr*="val"]', desc: 'An attribute contains the text', ex: '[class*="card"]' },
      { code: '[attr^="val"]', desc: 'An attribute starts with the text', ex: '[href^="/api"]' },
      { code: 'A B', desc: 'B nested anywhere inside A', ex: 'form input' },
      { code: 'A > B', desc: 'B is a direct child of A', ex: 'ul > li' },
      { code: 'A + B', desc: 'B right after sibling A', ex: 'label + input' },
      { code: ':nth-child(n)', desc: 'The nth child of its parent', ex: 'li:nth-child(2)' },
      { code: ':not(X)', desc: "Elements that don't match X", ex: 'input:not(:disabled)' },
      { code: ':checked  :focus', desc: 'Elements in a given state', ex: 'input:checked' },
      { code: 'A, B', desc: 'Match A or B', ex: 'h1, h2' },
    ],
    tip:
      'For tests, prefer ids and data-* attributes over class or :nth-child — ' +
      "they don't change when the styling does.",
  },
  {
    family: 'XPath',
    tag: 'document.evaluate()',
    accent: '#ffb547',
    blurb:
      'A path language for HTML. More verbose than CSS, but it can match by ' +
      'visible text and navigate upward to ancestors.',
    rows: [
      { code: '//tag', desc: 'Any <tag>, anywhere in the page', ex: '//button' },
      { code: '/tag', desc: 'A direct child, step by step', ex: '/html/body' },
      { code: '//*', desc: 'Any element type', ex: '//*[@role="dialog"]' },
      { code: '//tag[@attr="val"]', desc: 'By attribute value', ex: '//input[@name="email"]' },
      { code: '//tag[@id="val"]', desc: 'By id', ex: '//a[@id="home"]' },
      { code: '//tag[n]', desc: 'The nth match (counting from 1)', ex: '//li[2]' },
      { code: '//tag[last()]', desc: 'The last match', ex: '//tr[last()]' },
      { code: '//tag[text()="X"]', desc: 'By exact visible text', ex: '//button[text()="Save"]' },
      { code: '//tag[contains(@a,"X")]', desc: 'An attribute contains text', ex: '//div[contains(@class,"card")]' },
      { code: '//tag[contains(.,"X")]', desc: 'The element text contains', ex: '//a[contains(.,"More")]' },
      { code: '..', desc: 'Step up to the parent element', ex: '//input/..' },
      { code: '[@a and @b]', desc: 'Several conditions at once', ex: '//input[@type="text" and @required]' },
    ],
    tip:
      'Only XPath can match by visible text or walk up to a parent — handy, ' +
      'but text-based matches break on copy edits.',
  },
  {
    family: 'ARIA',
    tag: 'Puppeteer  aria/  selectors',
    accent: '#8d6bff',
    blurb:
      "Puppeteer's aria/ engine finds elements by their accessibility role " +
      'and name — the way assistive technology sees the page.',
    rows: [
      { code: 'aria/Name', desc: 'By accessible name', ex: 'aria/Sign in' },
      { code: 'aria/Name[role="r"]', desc: 'Accessible name and role', ex: 'aria/Sign in[role="button"]' },
      { code: 'aria/[role="r"]', desc: 'By role alone', ex: 'aria/[role="dialog"]' },
    ],
    notes: [
      {
        title: 'Where the accessible name comes from',
        body: 'aria-labelledby → aria-label → visible text, alt or a <label> → title.',
      },
      {
        title: 'Common roles',
        body: 'button · link · textbox · checkbox · radio · heading · list · dialog · img · navigation · banner · main',
      },
    ],
    tip:
      'Finds elements by purpose, the way a screen reader does — resilient to ' +
      'markup changes, and it doubles as an accessibility check.',
  },
]

function close() {
  emit('close')
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === 'undefined') return
    if (isOpen) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
      nextTick(() => closeBtn.value?.focus())
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  },
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="cs">
      <div v-if="open" class="cs-backdrop" @click.self="close">
        <div
          class="cs-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cs-title"
        >
          <header class="cs-head">
            <div class="cs-head-text">
              <h2 id="cs-title">Selectors cheat sheet</h2>
              <p>
                A selector tells a tool which element you mean. Here are the
                three families and their most common patterns.
              </p>
            </div>
            <button
              ref="closeBtn"
              type="button"
              class="cs-close"
              aria-label="Close cheat sheet"
              @click="close"
            >
              ✕
            </button>
          </header>

          <div class="cs-body">
            <section
              v-for="fam in SHEET"
              :key="fam.family"
              class="cs-section"
              :style="{ '--accent': fam.accent }"
            >
              <div class="cs-section-head">
                <h3>{{ fam.family }}</h3>
                <code class="cs-section-tag">{{ fam.tag }}</code>
              </div>
              <p class="cs-blurb">{{ fam.blurb }}</p>

              <table class="cs-table">
                <tbody>
                  <tr v-for="row in fam.rows" :key="row.code">
                    <td class="cs-td-code">
                      <code>{{ row.code }}</code>
                    </td>
                    <td class="cs-td-desc">
                      <span>{{ row.desc }}</span>
                      <code class="cs-ex">{{ row.ex }}</code>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-for="note in fam.notes || []" :key="note.title" class="cs-note">
                <span class="cs-note-title">{{ note.title }}</span>
                <span class="cs-note-body">{{ note.body }}</span>
              </div>

              <p class="cs-tip">
                <span class="cs-tip-tag">Tip</span>{{ fam.tip }}
              </p>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cs-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(6, 6, 10, 0.74);
  backdrop-filter: blur(5px);
}

.cs-modal {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 880px;
  max-height: 86vh;
  border-radius: 18px;
  border: 1px solid #2c2c38;
  background: #15151c;
  color: #e8e8ee;
  box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.9);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}

.cs-head {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px 16px;
  border-bottom: 1px solid #2c2c38;
}

.cs-head-text h2 {
  margin: 0 0 4px;
  font-size: 1.3rem;
  font-weight: 800;
  color: #f5f5f7;
}

.cs-head-text p {
  margin: 0;
  max-width: 60ch;
  font-size: 0.86rem;
  line-height: 1.5;
  color: #9a9aac;
}

.cs-close {
  flex-shrink: 0;
  margin: 0;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  border: 1px solid #3a3a48;
  background: #20202b;
  color: #e8e8ee;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.cs-close:hover {
  background: #2a2a38;
  border-color: #ff2d95;
}

.cs-close:focus-visible {
  outline: 3px solid #ff2d95;
  outline-offset: 2px;
}

.cs-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 6px 22px 22px;
  scrollbar-width: thin;
  scrollbar-color: #34343f transparent;
}

.cs-section {
  padding: 18px 0;
  border-bottom: 1px solid #23232d;
}

.cs-section:last-child {
  border-bottom: none;
  padding-bottom: 2px;
}

.cs-section-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.cs-section-head h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--accent);
}

.cs-section-tag {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.72rem;
  color: #75758a;
}

.cs-blurb {
  margin: 6px 0 12px;
  font-size: 0.86rem;
  line-height: 1.5;
  color: #b9b9c8;
}

.cs-table {
  width: 100%;
  border-collapse: collapse;
}

.cs-table td {
  padding: 7px 0;
  border-top: 1px solid #23232d;
  vertical-align: top;
  text-align: left;
}

.cs-table tr:first-child td {
  border-top: none;
}

.cs-td-code {
  width: 1%;
  white-space: nowrap;
  padding-right: 18px;
}

.cs-td-code code {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #f3f3f8;
  background: #0f0f14;
  border: 1px solid #2c2c38;
  border-left: 3px solid var(--accent);
  border-radius: 6px;
  padding: 3px 8px;
}

.cs-td-desc {
  font-size: 0.85rem;
  line-height: 1.45;
  color: #c4c4d2;
}

.cs-ex {
  display: inline-block;
  margin-left: 8px;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.76rem;
  color: #8d8d9e;
}

.cs-ex::before {
  content: "e.g. ";
  color: #5b5b6e;
}

.cs-note {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 10px;
  padding: 9px 12px;
  border-radius: 9px;
  background: #1a1a22;
  border: 1px solid #26262f;
}

.cs-note-title {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--accent);
}

.cs-note-body {
  font-size: 0.82rem;
  line-height: 1.45;
  color: #c4c4d2;
}

.cs-tip {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0 0;
  font-size: 0.82rem;
  line-height: 1.5;
  color: #9a9aac;
}

.cs-tip-tag {
  flex-shrink: 0;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #14141a;
  background: var(--accent);
  border-radius: 999px;
  padding: 2px 8px;
}

/* ---- transition ---- */
.cs-enter-active,
.cs-leave-active {
  transition: opacity 0.2s ease;
}

.cs-enter-from,
.cs-leave-to {
  opacity: 0;
}

.cs-enter-active .cs-modal,
.cs-leave-active .cs-modal {
  transition: transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.cs-enter-from .cs-modal,
.cs-leave-to .cs-modal {
  transform: scale(0.95) translateY(12px);
}

@media (prefers-reduced-motion: reduce) {
  .cs-enter-active,
  .cs-leave-active,
  .cs-enter-active .cs-modal,
  .cs-leave-active .cs-modal {
    transition: none;
  }
}

/* ---- mobile: stack the table rows ---- */
@media (max-width: 560px) {
  .cs-table,
  .cs-table tbody,
  .cs-table tr,
  .cs-table td {
    display: block;
  }
  .cs-table td {
    border-top: none;
    padding: 0;
  }
  .cs-table tr {
    padding: 9px 0;
    border-top: 1px solid #23232d;
  }
  .cs-table tr:first-child {
    border-top: none;
  }
  .cs-td-code {
    width: auto;
    white-space: normal;
    margin-bottom: 4px;
  }
  .cs-ex {
    margin-left: 0;
    display: block;
    margin-top: 2px;
  }
}
</style>
