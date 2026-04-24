<script setup>
import { computed, ref, watch } from "vue";
import VoteImagePair from "./VoteImagePair.vue";
import { TEAM_IMAGES } from "./team-images";

// ---------------------------------------------------------------------------
// Character metadata — mirrors docs/brand/team/<role>/character.md tagline
// ---------------------------------------------------------------------------

const ROLES = ["cofounder", "developer", "marketing", "tester", "designer", "genai"];

const TEAM = {
  cofounder: {
    name: "Marcus Gainsford",
    roleLabel: "Co-Founder",
    meta: "41 · Mixed Black/Portuguese heritage",
    description:
      "The person you'd want leading a pitch meeting. Steady, decisive, no wasted words. Clearly been through a few companies before, knows the tough questions, and isn't afraid to give the honest answer.",
    roleAtBrevid:
      "Runs the business side. Decides what Brevid should build and who'll pay for it. Quick to kill ideas that aren't working.",
  },
  developer: {
    name: "Isla Shipley",
    roleLabel: "Developer",
    meta: "28 · Irish",
    description:
      "Reads as senior rather than junior. Focused, a bit dry, quick to spot what might break. The kind of engineer you trust with the hard problems — not flashy, just quietly thorough.",
    roleAtBrevid:
      "Writes the code behind Brevid — the parts you see and the engine doing the heavy lifting out of sight. Picky about getting it right the first time so nothing breaks later.",
  },
  marketing: {
    name: "Chirag Pitchani",
    roleLabel: "Marketing",
    meta: "32 · South Asian Indian",
    description:
      "Warm, open, genuinely interested in people. Not a slick-salesperson archetype — more like someone who's fun to have in the room and actually explains things. Positive energy without being performative.",
    roleAtBrevid:
      "Gets the right customers to notice Brevid and choose it. Only counts wins that end in actual sales — everything else is just noise.",
  },
  tester: {
    name: "Haru Coverdale",
    roleLabel: "Tester",
    meta: "28 · Biracial Japanese/Scandinavian · non-binary",
    description:
      "Quietly watchful. Says less than they notice. Precise, thoughtful, just a bit merciless about quality — the kind of person who catches the thing everyone else missed.",
    roleAtBrevid:
      "The last person between a bug and a customer. Finds the weird edge cases and won't let them through.",
  },
  designer: {
    name: "Eunji Gridley",
    roleLabel: "Designer",
    meta: "34 · Korean",
    description:
      "Composed, confident, aesthetically certain. Someone with strong opinions about how things should look — and the patience to defend them calmly. Poised rather than loud.",
    roleAtBrevid:
      "Shapes how Brevid looks and feels. Makes every screen obvious enough that busy customers can get things done without stopping to think.",
  },
  genai: {
    name: "Lucia Nodari",
    roleLabel: "GenAI Specialist",
    meta: "33 · Neapolitan Italian",
    description:
      "Deep-in-the-math but approachable. Relaxed and curious rather than intense — the kind of person who can explain something complicated without making you feel dumb.",
    roleAtBrevid:
      "Runs the AI systems that actually make the videos — the voices, the faces, the whole thing. Focused on getting reliable results every time.",
  },
};

// ---------------------------------------------------------------------------
// localStorage-backed hero seed map
// ---------------------------------------------------------------------------

const STORAGE_KEY = "brevid-team-hero-seeds";

function loadHeroSeeds() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const out = {};
    for (const role of ROLES) {
      const v = parsed[role];
      if (typeof v === "number" && Number.isFinite(v)) out[role] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function persistHeroSeeds(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* storage full or disabled — silently ignore */
  }
}

const heroSeeds = ref(loadHeroSeeds());
watch(heroSeeds, persistHeroSeeds, { deep: true });

// ---------------------------------------------------------------------------
// Tournament state — single-elimination, queue style
// ---------------------------------------------------------------------------

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const mode = ref("landing");           // "landing" | "intro" | "picker"
const activeRole = ref(null);
const remaining = ref([]);
const matchNumber = ref(1);

const lockedCount = computed(() =>
  ROLES.reduce((n, r) => (typeof heroSeeds.value[r] === "number" ? n + 1 : n), 0),
);

const candidatePool = computed(() =>
  activeRole.value ? TEAM_IMAGES[activeRole.value] ?? [] : [],
);
const totalMatches = computed(() => Math.max(0, candidatePool.value.length - 1));
const progress = computed(() => {
  if (totalMatches.value === 0) return 100;
  return Math.min(100, ((matchNumber.value - 1) / totalMatches.value) * 100);
});

const currentPair = computed(() => {
  if (mode.value !== "picker") return null;
  if (remaining.value.length < 2) return null;
  return [remaining.value[0], remaining.value[1]];
});
const isComplete = computed(
  () =>
    mode.value === "picker" &&
    candidatePool.value.length > 0 &&
    remaining.value.length === 1,
);
const winner = computed(() => (isComplete.value ? remaining.value[0] : null));

function goToIntro(role) {
  activeRole.value = role;
  remaining.value = [];
  matchNumber.value = 1;
  mode.value = "intro";
}

function startVoting() {
  if (!activeRole.value) return;
  remaining.value = shuffle(TEAM_IMAGES[activeRole.value] ?? []);
  matchNumber.value = 1;
  mode.value = "picker";
}

function goToLanding() {
  mode.value = "landing";
  activeRole.value = null;
  remaining.value = [];
}

function backToIntro() {
  remaining.value = [];
  matchNumber.value = 1;
  mode.value = "intro";
}

function pickWinner(seed) {
  if (!currentPair.value) return;
  const [a, b] = currentPair.value;
  if (seed !== a && seed !== b) return;
  remaining.value = [...remaining.value.slice(2), seed];
  matchNumber.value += 1;
}

function tryAgain() {
  if (!activeRole.value) return;
  delete heroSeeds.value[activeRole.value];
  remaining.value = shuffle(TEAM_IMAGES[activeRole.value] ?? []);
  matchNumber.value = 1;
}

// Auto-save winner when tournament completes
watch(winner, (w) => {
  if (w !== null && activeRole.value) {
    heroSeeds.value = { ...heroSeeds.value, [activeRole.value]: w };
  }
});

function imageUrl(role, seed) {
  return `/team-images/${role}/${seed}.jpg`;
}

const activeMember = computed(() =>
  activeRole.value ? TEAM[activeRole.value] : null,
);
</script>

<template>
  <div class="tv-root">
    <!-- LANDING -->
    <Transition name="fade" mode="out-in">
      <div v-if="mode === 'landing'" key="landing" class="tv-landing">
        <header class="tv-hero">
          <p class="tv-kicker">Brevid AI Team</p>
          <h1 class="tv-title">Team Vote</h1>
          <p class="tv-lede">
            Pick the hero face for each AI agent. Two candidates at a time —
            last one standing wins. {{ lockedCount }} of {{ ROLES.length }} locked.
          </p>
        </header>

        <div class="tv-grid">
          <button
            v-for="role in ROLES"
            :key="role"
            type="button"
            class="tv-card"
            :class="{ 'tv-card--locked': typeof heroSeeds[role] === 'number' }"
            @click="goToIntro(role)"
          >
            <span class="tv-card-role">{{ TEAM[role].roleLabel }}</span>
            <span class="tv-card-name">{{ TEAM[role].name }}</span>
            <span v-if="typeof heroSeeds[role] === 'number'" class="tv-badge tv-badge--locked">
              <span class="tv-dot"></span>
              Hero locked · seed {{ heroSeeds[role] }}
            </span>
            <span v-else class="tv-badge">Vote on candidates →</span>
          </button>
        </div>
      </div>

      <!-- INTRO -->
      <div v-else-if="mode === 'intro' && activeMember" key="intro" class="tv-intro">
        <header class="tv-intro-head">
          <button type="button" class="tv-ghost-btn" @click="goToLanding">
            ← Back to roster
          </button>
        </header>

        <div class="tv-intro-body">
          <p class="tv-kicker">{{ activeMember.roleLabel }}</p>
          <h2 class="tv-intro-name">{{ activeMember.name }}</h2>

          <section class="tv-intro-section">
            <h3 class="tv-intro-label">The vibe</h3>
            <p class="tv-intro-copy">{{ activeMember.description }}</p>
          </section>

          <section class="tv-intro-section">
            <h3 class="tv-intro-label">What they do</h3>
            <p class="tv-intro-copy">{{ activeMember.roleAtBrevid }}</p>
          </section>

          <p class="tv-intro-prompt">
            Pick the face that feels right for someone in this role — two at a time, last one standing wins.
          </p>

          <div v-if="typeof heroSeeds[activeRole] === 'number'" class="tv-intro-locked">
            <p class="tv-intro-locked-line">
              <span class="tv-dot"></span>
              Currently locked · seed {{ heroSeeds[activeRole] }}
            </p>
            <p class="tv-intro-locked-note">
              Starting a new vote will clear this and re-shuffle the candidate pool.
            </p>
          </div>

          <div class="tv-intro-actions">
            <button
              v-if="typeof heroSeeds[activeRole] === 'number'"
              type="button"
              class="tv-primary-btn"
              @click="tryAgain"
            >
              Re-vote · {{ candidatePool.length }} candidates
            </button>
            <button
              v-else
              type="button"
              class="tv-primary-btn"
              @click="startVoting"
            >
              Start voting · {{ candidatePool.length }} candidates, {{ totalMatches }} matches
            </button>
          </div>
        </div>
      </div>

      <!-- PICKER -->
      <div v-else-if="mode === 'picker' && activeMember" key="picker" class="tv-picker">
        <header class="tv-picker-head">
          <div>
            <p class="tv-kicker">{{ activeMember.roleLabel }}</p>
            <h2 class="tv-picker-name">{{ activeMember.name }}</h2>
          </div>
          <div class="tv-picker-head-actions">
            <button type="button" class="tv-ghost-btn" @click="backToIntro">
              ← Intro
            </button>
            <button type="button" class="tv-ghost-btn" @click="goToLanding">
              ← Roster
            </button>
          </div>
        </header>

        <!-- Mobile-only floating close button (header is hidden on mobile) -->
        <button
          v-if="!isComplete"
          type="button"
          class="tv-floating-close"
          aria-label="Back to roster"
          @click="goToLanding"
        >
          ×
        </button>

        <!-- TOURNAMENT IN PROGRESS -->
        <Transition name="slide-fade" mode="out-in">
          <div v-if="!isComplete && currentPair" :key="matchNumber" class="tv-stage">
            <p class="tv-match">
              Match {{ matchNumber }} of {{ totalMatches }}
            </p>
            <VoteImagePair
              :role="activeRole"
              :pair="currentPair"
              @pick="pickWinner"
            />
          </div>

          <!-- TOURNAMENT COMPLETE -->
          <div v-else-if="isComplete && winner !== null" key="complete" class="tv-complete">
            <p class="tv-kicker tv-kicker--small">Hero locked · auto-saved</p>
            <h3 class="tv-complete-name">{{ activeMember.name }}</h3>
            <div class="tv-winner">
              <img
                :src="imageUrl(activeRole, winner)"
                :alt="`Hero seed ${winner}`"
                class="tv-winner-img"
              />
              <p class="tv-winner-seed">seed: {{ winner }}</p>
            </div>
            <div class="tv-actions">
              <button type="button" class="tv-outline-btn" @click="tryAgain">
                ↻ Try again
              </button>
              <button type="button" class="tv-primary-btn" @click="goToLanding">
                Back to roster
              </button>
            </div>
          </div>

          <!-- EMPTY POOL -->
          <div v-else key="empty" class="tv-empty">
            <p>No candidate images for this role yet.</p>
            <button type="button" class="tv-outline-btn" @click="goToLanding">
              ← Back to roster
            </button>
          </div>
        </Transition>

        <footer v-if="!isComplete && candidatePool.length > 1" class="tv-progress-wrap">
          <div class="tv-progress">
            <div class="tv-progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="tv-progress-label">
            {{ matchNumber }} / {{ totalMatches }}
          </span>
        </footer>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tv-root {
  min-height: 100vh;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 48px 24px 96px;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
}

.tv-kicker {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  margin: 0;
}
.tv-kicker--small {
  font-size: 10px;
}

/* ---- Landing ---- */
.tv-landing {
  max-width: 1080px;
  margin: 0 auto;
}
.tv-hero {
  text-align: center;
  margin-bottom: 40px;
}
.tv-title {
  font-size: 56px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 8px 0 16px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.tv-lede {
  color: var(--vp-c-text-2);
  max-width: 640px;
  margin: 0 auto;
  font-size: 17px;
  line-height: 1.5;
}

.tv-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 40px;
}
@media (min-width: 640px) {
  .tv-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 960px) {
  .tv-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.tv-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  text-align: left;
  padding: 22px 22px 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  cursor: pointer;
  transition:
    transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
    border-color 260ms ease-out,
    box-shadow 260ms ease-out;
  font: inherit;
  color: inherit;
}
.tv-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 24px 48px -20px color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
}
.tv-card:focus-visible {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
}
.tv-card--locked {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 40%, var(--vp-c-divider));
}
.tv-card-role {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}
.tv-card-name {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.15;
}

.tv-badge {
  margin-top: 4px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-text-2);
}
.tv-badge--locked {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 12px;
}
.tv-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 10px color-mix(in srgb, var(--vp-c-brand-1) 60%, transparent);
}

/* ---- Intro ---- */
.tv-intro {
  max-width: 720px;
  margin: 0 auto;
}
.tv-intro-head {
  display: flex;
  justify-content: flex-start;
  padding-bottom: 8px;
}
.tv-intro-body {
  padding: 32px 0 48px;
}
.tv-intro-name {
  font-size: 44px;
  font-weight: 700;
  margin: 10px 0 4px;
  letter-spacing: -0.02em;
  line-height: 1.05;
}
.tv-intro-meta {
  color: var(--vp-c-text-2);
  margin: 0;
  font-size: 15px;
}
.tv-intro-section {
  margin-top: 32px;
}
.tv-intro-label {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  margin: 0 0 8px;
  font-weight: 600;
}
.tv-intro-copy {
  font-size: 16px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  margin: 0;
}
.tv-intro-prompt {
  margin: 24px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-style: italic;
}
.tv-floating-close {
  display: none; /* shown only on mobile — see media query below */
}
.tv-intro-locked {
  margin-top: 32px;
  padding: 16px 18px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
}
.tv-intro-locked-line {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 13px;
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.tv-intro-locked-note {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.tv-intro-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 32px;
}
.tv-intro-actions .tv-primary-btn {
  padding: 14px 22px;
  font-size: 15px;
}

/* ---- Picker ---- */
.tv-picker {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 144px);
}
.tv-picker-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.tv-picker-head-actions {
  display: flex;
  gap: 6px;
}
.tv-picker-name {
  font-size: 28px;
  font-weight: 600;
  margin: 4px 0 0;
  letter-spacing: -0.01em;
}
.tv-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}
.tv-match {
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin-bottom: 24px;
  letter-spacing: 0.02em;
}

.tv-progress-wrap {
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 560px;
  margin: 0 auto;
}
.tv-progress {
  flex: 1;
  height: 6px;
  background: var(--vp-c-bg-soft);
  border-radius: 999px;
  overflow: hidden;
}
.tv-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  transition: width 350ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.tv-progress-label {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 12px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  letter-spacing: 0.02em;
}

/* ---- Complete ---- */
.tv-complete {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
}
.tv-complete-name {
  font-size: 36px;
  font-weight: 700;
  margin: 8px 0 24px;
  letter-spacing: -0.01em;
}
.tv-winner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.tv-winner-img {
  width: min(420px, 80vw);
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 24px;
  border: 4px solid color-mix(in srgb, var(--vp-c-brand-1) 50%, transparent);
  box-shadow: 0 40px 80px -16px color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent);
}
.tv-winner-seed {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 18px;
  color: var(--vp-c-text-1);
  margin: 0;
}
.tv-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  flex-wrap: wrap;
  justify-content: center;
}
.tv-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--vp-c-text-2);
}

/* ---- Buttons ---- */
.tv-ghost-btn,
.tv-outline-btn,
.tv-primary-btn {
  padding: 10px 18px;
  border-radius: 10px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 160ms ease-out,
    border-color 160ms ease-out,
    transform 160ms ease-out;
}
.tv-ghost-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--vp-c-text-2);
}
.tv-ghost-btn:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.tv-outline-btn {
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}
.tv-outline-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.tv-primary-btn {
  background: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-1);
  color: #fff;
}
.tv-primary-btn:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

/* ---- Transitions ---- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 260ms ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-fade-enter-active {
  transition:
    opacity 420ms cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.slide-fade-leave-active {
  transition:
    opacity 200ms ease-in,
    transform 200ms ease-in;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ---- Mobile polish (≤ 719px) ---- */
@media (max-width: 719px) {
  .tv-root {
    padding: 20px 14px 24px;
  }

  /* Landing */
  .tv-title {
    font-size: 40px;
  }
  .tv-lede {
    font-size: 15px;
  }
  .tv-card {
    padding: 18px 18px 16px;
  }
  .tv-card-name {
    font-size: 20px;
  }

  /* Intro */
  .tv-intro-name {
    font-size: 32px;
    line-height: 1.1;
  }
  .tv-intro-body {
    padding: 20px 0 32px;
  }
  .tv-intro-section {
    margin-top: 24px;
  }
  .tv-intro-copy {
    font-size: 15px;
  }
  .tv-intro-actions .tv-primary-btn {
    width: 100%;
    padding: 14px 16px;
    font-size: 14px;
  }

  /* Picker — hide top chrome entirely so the two candidate images stay
     above the fold. A floating ×-button replaces the header nav. */
  .tv-picker {
    min-height: calc(100vh - 44px);
    position: relative;
  }
  .tv-picker-head {
    display: none;
  }
  .tv-stage {
    padding: 8px 0 4px;
  }
  .tv-match {
    display: none; /* match count sits next to the progress bar instead */
  }
  .tv-progress-wrap {
    padding-top: 10px;
    border-top: none;
    max-width: none;
  }

  /* Floating close button — replaces the picker header nav on mobile */
  .tv-floating-close {
    position: fixed;
    top: 12px;
    right: 12px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid var(--vp-c-divider);
    background: color-mix(in srgb, var(--vp-c-bg) 85%, transparent);
    backdrop-filter: blur(8px);
    color: var(--vp-c-text-2);
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 4px;
    transition:
      transform 160ms ease-out,
      background-color 160ms ease-out,
      color 160ms ease-out;
  }
  .tv-floating-close:active {
    transform: scale(0.94);
  }
  .tv-floating-close:hover {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
  }

  /* Complete */
  .tv-complete {
    padding: 24px 0;
  }
  .tv-complete-name {
    font-size: 28px;
    margin-top: 4px;
    margin-bottom: 18px;
  }
  .tv-winner-img {
    width: min(320px, 85vw);
  }
  .tv-actions {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
  .tv-actions .tv-outline-btn,
  .tv-actions .tv-primary-btn {
    width: 100%;
  }
}
</style>
