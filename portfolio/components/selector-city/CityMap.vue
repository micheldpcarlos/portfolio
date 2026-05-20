<script setup>
import { ref, computed, watch } from 'vue'
import { state } from './cityStore.js'
import { SELECTOR_CATALOG } from './selectorCatalog.js'

const STREET_Y = { 'st-main': 200, 'st-maple': 410, 'st-oak': 620 }
const X_START = 118
const X_END = 884
const GATE = { x: 64, y: 104 }

const streetRows = computed(() =>
  state.city.streets.map((s) => ({ ...s, y: STREET_Y[s.id] })),
)

const placedHouses = computed(() => {
  const out = []
  for (const street of state.city.streets) {
    const houses = state.city.houses
      .filter((h) => h.streetId === street.id)
      .sort((a, b) => a.lot - b.lot)
    const step = (X_END - X_START) / houses.length
    for (const h of houses) {
      out.push({
        house: h,
        x: X_START + step * (h.lot + 0.5),
        y: STREET_Y[street.id],
      })
    }
  }
  return out
})

const targetPlace = computed(() =>
  placedHouses.value.find((p) => p.house.isTarget),
)

const selectedSelector = computed(
  () => SELECTOR_CATALOG.find((s) => s.id === state.selectedSelectorId) || null,
)
const navMode = computed(() => selectedSelector.value?.nav || null)

const routeD = computed(() => {
  const t = targetPlace.value
  if (!t) return ''
  return `M ${GATE.x} ${GATE.y} L ${GATE.x} ${t.y} L ${t.x} ${t.y}`
})
const routeLen = computed(() => {
  const t = targetPlace.value
  if (!t) return 1
  return t.y - GATE.y + Math.abs(t.x - GATE.x)
})

const hudText = computed(() => {
  const s = selectedSelector.value
  if (!s) return 'Pick an address from the book to send the courier →'
  const byNav = {
    route: 'following the route, turn by turn…',
    scan: 'scanning the city for a matching paint colour…',
    beam: 'air ID — sweeping rooftops for role + name…',
    landmark: 'heading for the named street, then the house…',
    nameplate: 'reading the mailbox nameplates…',
    pin: 'going straight to the planted pin…',
  }
  return `${s.label}: ${byNav[s.nav]}`
})

const mapDescription = computed(
  () =>
    `A top-down map of ${state.city.houses.length} houses across three streets. ` +
    `The glowing house on Maple Street is the target element that a selector must find.`,
)

const stars = [
  [120, 46], [260, 30], [410, 58], [560, 24], [690, 50],
  [820, 36], [180, 78], [470, 22], [760, 80], [880, 64],
]

const shaking = ref(false)
watch(
  () => state.triggeredEvents.length,
  () => {
    if (state.lastEventId === 'refactor-district' && !state.reducedMotion) {
      shaking.value = true
      setTimeout(() => { shaking.value = false }, 680)
    }
  },
)
</script>

<template>
  <div class="sc-mapwrap">
    <svg
      class="sc-map"
      :class="{ 'sc-rm': state.reducedMotion, 'sc-shaking': shaking }"
      viewBox="0 0 920 680"
      role="img"
      aria-labelledby="sc-map-title sc-map-desc"
    >
      <title id="sc-map-title">Selector City</title>
      <desc id="sc-map-desc">{{ mapDescription }}</desc>

      <defs>
        <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#17171f" />
          <stop offset="1" stop-color="#0c0c11" />
        </linearGradient>
        <linearGradient id="sc-beamgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#00ffc6" stop-opacity="0" />
          <stop offset="0.5" stop-color="#00ffc6" stop-opacity="0.4" />
          <stop offset="1" stop-color="#00ffc6" stop-opacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="920" height="680" fill="url(#sc-sky)" />
      <circle
        v-for="(s, i) in stars"
        :key="'star' + i"
        class="sc-star"
        :cx="s[0]"
        :cy="s[1]"
        r="1.5"
        :style="{ animationDelay: (i * 0.4) + 's' }"
      />

      <g class="sc-city">
        <!-- roads -->
        <rect class="sc-road" x="52" y="88" width="24" height="548" rx="4" />
        <rect
          v-for="row in streetRows"
          :key="'road' + row.id"
          class="sc-road"
          x="76"
          :y="row.y - 3"
          width="812"
          height="16"
          rx="4"
        />
        <line
          v-for="row in streetRows"
          :key="'lane' + row.id"
          class="sc-lane"
          x1="88"
          :y1="row.y + 5"
          x2="876"
          :y2="row.y + 5"
        />

        <!-- city gate / DOM root -->
        <g class="sc-gate">
          <rect x="34" y="58" width="60" height="44" rx="6" />
          <polygon points="30,58 64,32 98,58" />
          <text class="sc-gate-label" x="64" y="86">root</text>
        </g>

        <!-- street signs -->
        <g
          v-for="row in streetRows"
          :key="'sign' + row.id"
          class="sc-sign"
          :class="{ 'is-lit': navMode === 'landmark' && row.id === state.originalTarget.streetId }"
        >
          <text class="sc-sign-name" x="114" :y="row.y - 116">{{ row.label }}</text>
          <text class="sc-sign-class" x="114" :y="row.y - 99">.{{ row.name }}</text>
        </g>

        <!-- houses -->
        <g
          v-for="p in placedHouses"
          :key="p.house.id"
          class="sc-house"
          :class="{
            'sc-house--target': p.house.isTarget,
            'sc-house--new': p.house.isNew,
          }"
          :style="{ transform: `translate(${p.x}px, ${p.y}px)` }"
        >
          <g class="sc-house-inner">
            <ellipse class="sc-shadow" cx="0" cy="6" rx="50" ry="9" />
            <polygon class="sc-roof" points="-52,-56 0,-90 52,-56" />
            <rect
              class="sc-body"
              x="-44"
              y="-56"
              width="88"
              height="56"
              rx="5"
              :style="{ fill: p.house.color }"
            />
            <rect class="sc-window" x="-32" y="-46" width="17" height="14" rx="2" />
            <rect class="sc-window" x="15" y="-46" width="17" height="14" rx="2" />
            <rect class="sc-door" x="-11" y="-24" width="22" height="24" rx="3" />
            <text class="sc-tag" x="0" y="-7">&lt;{{ p.house.tag }}&gt;</text>

            <g v-if="p.house.isTarget" class="sc-badge">
              <rect x="-38" y="-126" width="76" height="22" rx="11" />
              <text x="0" y="-111">🎯 TARGET</text>
            </g>
          </g>

          <!-- selection ring -->
          <circle
            v-if="p.house.isTarget && selectedSelector"
            class="sc-ring"
            cx="0"
            cy="-44"
            r="68"
          />
        </g>

        <!-- ============ navigation overlays ============ -->
        <template v-if="targetPlace">
          <!-- route: xpath / nth-child / structure -->
          <g v-if="navMode === 'route'" :key="'route' + state.navTick">
            <path
              class="sc-route"
              :d="routeD"
              :style="{ '--len': routeLen }"
            />
            <circle class="sc-turn" :cx="GATE.x" :cy="GATE.y" r="6" />
            <circle class="sc-turn" :cx="GATE.x" :cy="targetPlace.y" r="6" />
            <circle
              class="sc-courier"
              r="9"
              :style="{ offsetPath: `path('${routeD}')` }"
            />
          </g>

          <!-- scan: class -->
          <g v-if="navMode === 'scan'" :key="'scan' + state.navTick">
            <circle
              class="sc-scan"
              :cx="targetPlace.x"
              :cy="targetPlace.y - 44"
              r="20"
            />
            <circle
              class="sc-scan sc-scan--2"
              :cx="targetPlace.x"
              :cy="targetPlace.y - 44"
              r="20"
            />
          </g>

          <!-- beam: aria -->
          <g v-if="navMode === 'beam'" :key="'beam' + state.navTick">
            <rect
              class="sc-beam"
              x="84"
              y="150"
              width="752"
              height="86"
              fill="url(#sc-beamgrad)"
            />
          </g>

          <!-- landmark: scoped-css -->
          <g v-if="navMode === 'landmark'" :key="'mark' + state.navTick">
            <path
              class="sc-drop"
              :d="`M ${targetPlace.x} ${targetPlace.y - 210} L ${targetPlace.x} ${targetPlace.y - 172}`"
            />
            <polygon
              class="sc-drop-head"
              :points="`${targetPlace.x - 9},${targetPlace.y - 172} ${targetPlace.x + 9},${targetPlace.y - 172} ${targetPlace.x},${targetPlace.y - 150}`"
            />
          </g>

          <!-- nameplate: text -->
          <g v-if="navMode === 'nameplate'" :key="'name' + state.navTick" class="sc-plate">
            <line
              :x1="targetPlace.x"
              :y1="targetPlace.y - 168"
              :x2="targetPlace.x"
              :y2="targetPlace.y - 132"
            />
            <rect
              :x="targetPlace.x - 58"
              :y="targetPlace.y - 200"
              width="116"
              height="32"
              rx="8"
            />
            <text :x="targetPlace.x" :y="targetPlace.y - 179">
              “{{ targetPlace.house.text || '—' }}”
            </text>
          </g>

          <!-- pin: id / data-testid -->
          <g
            v-if="navMode === 'pin'"
            :key="'pin' + state.navTick"
            :transform="`translate(${targetPlace.x}, ${targetPlace.y - 104})`"
          >
            <g class="sc-pin">
              <path
                class="sc-pin-body"
                :class="state.selectedSelectorId === 'testid' ? 'is-testid' : 'is-id'"
                d="M0,40 C-22,8 -22,-10 0,-10 C22,-10 22,8 0,40 Z"
              />
              <circle class="sc-pin-dot" cx="0" cy="3" r="11" />
              <text class="sc-pin-text" x="0" y="7">
                {{ state.selectedSelectorId === 'testid' ? '◎' : '#' }}
              </text>
            </g>
          </g>
        </template>
      </g>

      <text class="sc-hud" x="22" y="36">{{ hudText }}</text>
    </svg>
  </div>
</template>

<style scoped>
.sc-mapwrap {
  border-radius: 18px;
  border: 1px solid #2c2c38;
  overflow: hidden;
  background: #0c0c11;
}

.sc-map {
  display: block;
  width: 100%;
  height: auto;
}

/* ---- ambient ---- */
.sc-star {
  fill: #ffffff;
  opacity: 0.25;
  animation: sc-twinkle 3.4s ease-in-out infinite;
}
@keyframes sc-twinkle {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.7; }
}

.sc-road {
  fill: #1c1c26;
  stroke: #2a2a38;
  stroke-width: 1;
}
.sc-lane {
  stroke: #45455a;
  stroke-width: 2;
  stroke-dasharray: 14 12;
}

.sc-gate rect,
.sc-gate polygon {
  fill: #24202e;
  stroke: #4a3f5e;
  stroke-width: 1.5;
}
.sc-gate-label {
  fill: #b9a9d4;
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

/* ---- street signs ---- */
.sc-sign-name {
  fill: #6f6f86;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.sc-sign-class {
  fill: #555569;
  font-size: 12.5px;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  transition: fill 0.3s ease;
}
.sc-sign.is-lit .sc-sign-class {
  fill: #00ffc6;
}
.sc-sign.is-lit .sc-sign-name {
  fill: #9a9aac;
}

/* ---- houses ---- */
.sc-house {
  transition: transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sc-house-inner {
  transform-box: fill-box;
  transform-origin: center bottom;
  animation: sc-pop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes sc-pop {
  from { transform: scale(0) translateY(26px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.sc-shadow { fill: rgba(0, 0, 0, 0.55); }
.sc-roof {
  fill: #2c2c3c;
  stroke: #3c3c50;
  stroke-width: 1;
}
.sc-body {
  stroke: rgba(0, 0, 0, 0.35);
  stroke-width: 1;
  opacity: 0.9;
  transition: fill 0.4s ease-out;
}
.sc-window {
  fill: #ffd98f;
  opacity: 0.92;
}
.sc-door {
  fill: #1a1a22;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 1;
}
.sc-tag {
  fill: #f3f3f8;
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

.sc-house--target .sc-house-inner {
  filter: drop-shadow(0 0 10px rgba(255, 45, 149, 0.85));
  animation: sc-pop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both,
    sc-glow 2.2s ease-in-out 0.5s infinite;
}
@keyframes sc-glow {
  0%, 100% { filter: drop-shadow(0 0 7px rgba(255, 45, 149, 0.6)); }
  50% { filter: drop-shadow(0 0 18px rgba(255, 45, 149, 1)); }
}
.sc-house--target .sc-body {
  opacity: 1;
}

.sc-badge rect {
  fill: #ff2d95;
}
.sc-badge text {
  fill: #fff;
  font-size: 11px;
  font-weight: 800;
  text-anchor: middle;
}

.sc-ring {
  fill: none;
  stroke: #ffb547;
  stroke-width: 2.5;
  stroke-dasharray: 7 9;
  opacity: 0.85;
  animation: sc-spin 9s linear infinite;
  transform-box: fill-box;
  transform-origin: center;
}
@keyframes sc-spin {
  to { transform: rotate(360deg); }
}

/* ---- route ---- */
.sc-route {
  fill: none;
  stroke: #ffb547;
  stroke-width: 4.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: var(--len);
  stroke-dashoffset: 0;
  animation: sc-draw 1s ease forwards;
}
@keyframes sc-draw {
  from { stroke-dashoffset: var(--len); }
  to { stroke-dashoffset: 0; }
}
.sc-turn {
  fill: #ffb547;
  stroke: #0c0c11;
  stroke-width: 2;
}
.sc-courier {
  fill: #ff7a59;
  stroke: #0c0c11;
  stroke-width: 2.5;
  offset-rotate: 0deg;
  animation: sc-deliver 1.05s ease forwards;
}
@keyframes sc-deliver {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}

/* ---- scan ---- */
.sc-scan {
  fill: none;
  stroke: #ffb547;
  stroke-width: 3;
  transform-box: fill-box;
  transform-origin: center;
  animation: sc-ripple 1.5s ease-out forwards;
}
.sc-scan--2 {
  animation-delay: 0.4s;
}
@keyframes sc-ripple {
  from { transform: scale(0.18); opacity: 0.7; }
  to { transform: scale(11); opacity: 0; }
}

/* ---- beam ---- */
.sc-beam {
  transform: translateY(0);
  animation: sc-sweep 1.5s ease-in-out forwards;
}
@keyframes sc-sweep {
  0% { transform: translateY(-180px); }
  100% { transform: translateY(440px); }
}

/* ---- landmark drop marker ---- */
.sc-drop {
  fill: none;
  stroke: #00ffc6;
  stroke-width: 3.5;
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: sc-draw2 0.5s ease forwards;
}
@keyframes sc-draw2 {
  to { stroke-dashoffset: 0; }
}
.sc-drop-head {
  fill: #00ffc6;
  opacity: 0;
  animation: sc-fadein 0.3s ease 0.4s forwards;
}
@keyframes sc-fadein {
  to { opacity: 1; }
}

/* ---- nameplate ---- */
.sc-plate {
  animation: sc-fadein 0.35s ease forwards;
}
.sc-plate line {
  stroke: #4f8cff;
  stroke-width: 2.5;
}
.sc-plate rect {
  fill: #1a1a22;
  stroke: #4f8cff;
  stroke-width: 2;
}
.sc-plate text {
  fill: #cfe0ff;
  font-size: 14px;
  font-weight: 700;
  text-anchor: middle;
}

/* ---- pin ---- */
.sc-pin {
  animation: sc-drop-in 0.7s cubic-bezier(0.3, 1.4, 0.5, 1) both;
}
@keyframes sc-drop-in {
  0% { transform: translateY(-72px); opacity: 0; }
  60% { opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}
.sc-pin-body.is-id {
  fill: #ffb547;
}
.sc-pin-body.is-testid {
  fill: #4f8cff;
}
.sc-pin-dot {
  fill: #0c0c11;
}
.sc-pin-text {
  fill: #fff;
  font-size: 13px;
  font-weight: 800;
  text-anchor: middle;
}

/* ---- HUD ---- */
.sc-hud {
  fill: #8d8d9e;
  font-size: 13px;
  font-weight: 600;
}

/* ---- earthquake ---- */
.sc-shaking .sc-city {
  animation: sc-quake 0.65s ease;
}
@keyframes sc-quake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

/* ---- reduced motion ---- */
.sc-map.sc-rm .sc-house,
.sc-map.sc-rm .sc-house-inner,
.sc-map.sc-rm .sc-star,
.sc-map.sc-rm .sc-ring,
.sc-map.sc-rm .sc-route,
.sc-map.sc-rm .sc-courier,
.sc-map.sc-rm .sc-scan,
.sc-map.sc-rm .sc-beam,
.sc-map.sc-rm .sc-drop,
.sc-map.sc-rm .sc-drop-head,
.sc-map.sc-rm .sc-plate,
.sc-map.sc-rm .sc-pin,
.sc-map.sc-rm .sc-city {
  animation: none !important;
  transition: none !important;
}
.sc-map.sc-rm .sc-house-inner { opacity: 1; transform: none; }
.sc-map.sc-rm .sc-route { stroke-dashoffset: 0; }
.sc-map.sc-rm .sc-courier { display: none; }
.sc-map.sc-rm .sc-drop { stroke-dashoffset: 0; }
.sc-map.sc-rm .sc-drop-head,
.sc-map.sc-rm .sc-plate { opacity: 1; }
.sc-map.sc-rm .sc-scan { display: none; }
.sc-map.sc-rm .sc-beam { opacity: 0.35; transform: translateY(220px); }
</style>
