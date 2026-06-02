<script setup>
import { computed } from 'vue'
import {
  state,
  mrr,
  activeCount,
  trialingCount,
  outstanding,
  churnRate,
  go,
} from '../store.js'

const money = (n) => '$' + n.toLocaleString('en-US')

const cards = computed(() => [
  { key: 'mrr', label: 'Monthly recurring revenue', value: money(mrr.value), delta: '+8.2%', up: true },
  { key: 'active', label: 'Active customers', value: String(activeCount.value), delta: '+3', up: true },
  { key: 'trialing', label: 'On trial', value: String(trialingCount.value), delta: '+1', up: true },
  { key: 'churn', label: 'Churn rate', value: churnRate.value + '%', delta: '-0.4%', up: false, good: true },
])

const maxTrend = computed(() => Math.max(...state.signupTrend, 1))

const recent = computed(() => state.customers.slice(0, 5))

const dotKind = {
  upgrade: 'good',
  trial: 'info',
  seats: 'info',
  alert: 'warn',
  churn: 'bad',
}
</script>

<template>
  <div class="nb-view" data-testid="view-dashboard">
    <header class="nb-view-head">
      <div>
        <h1>Overview</h1>
        <p class="nb-sub">Here's how {{ state.settings.workspaceName }} is doing today.</p>
      </div>
    </header>

    <section class="nb-stats" aria-label="Key metrics">
      <article
        v-for="c in cards"
        :key="c.key"
        class="nb-stat"
        :data-testid="`stat-${c.key}`"
      >
        <p class="nb-stat-label">{{ c.label }}</p>
        <p class="nb-stat-value">{{ c.value }}</p>
        <p class="nb-stat-delta" :class="{ up: c.up === c.good ? true : c.up, down: !c.up }">
          <span aria-hidden="true">{{ c.up ? '▲' : '▼' }}</span> {{ c.delta }}
          <span class="nb-stat-period">vs last month</span>
        </p>
      </article>
    </section>

    <div class="nb-grid">
      <section class="nb-panel nb-chart-panel">
        <div class="nb-panel-head">
          <h2>New signups</h2>
          <span class="nb-panel-hint">last 12 weeks</span>
        </div>
        <div class="nb-bars" role="img" aria-label="Weekly signup bar chart">
          <div
            v-for="(v, i) in state.signupTrend"
            :key="i"
            class="nb-bar"
            :style="{ height: Math.round((v / maxTrend) * 100) + '%' }"
            :title="`Week ${i + 1}: ${v} signups`"
          >
            <span class="nb-bar-val">{{ v }}</span>
          </div>
        </div>
      </section>

      <section class="nb-panel">
        <div class="nb-panel-head">
          <h2>Recent activity</h2>
        </div>
        <ul class="nb-activity" data-testid="activity-feed">
          <li v-for="a in state.activity" :key="a.id">
            <span class="nb-dot" :class="dotKind[a.kind] || 'info'" aria-hidden="true"></span>
            <span class="nb-act-text">
              <strong>{{ a.who }}</strong> {{ a.action }}
            </span>
            <span class="nb-act-when">{{ a.when }}</span>
          </li>
        </ul>
      </section>
    </div>

    <section class="nb-panel">
      <div class="nb-panel-head">
        <h2>Newest customers</h2>
        <button class="nb-link" data-testid="see-all-customers" @click="go('customers')">
          See all →
        </button>
      </div>
      <table class="nb-mini-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Company</th>
            <th>Plan</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in recent" :key="c.id">
            <td>{{ c.name }}</td>
            <td>{{ c.company }}</td>
            <td>{{ c.plan }}</td>
            <td><span class="nb-pill" :class="`s-${c.status}`">{{ c.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.nb-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.nb-view-head h1 {
  margin: 0;
  font-size: 1.55rem;
  color: #f5f5f7;
}
.nb-sub {
  margin: 4px 0 0;
  color: #8a8a9c;
  font-size: 0.92rem;
}
.nb-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}
.nb-stat {
  padding: 16px 18px;
  border-radius: 14px;
  background: #15151e;
  border: 1px solid #25252f;
}
.nb-stat-label {
  margin: 0;
  font-size: 0.78rem;
  color: #8a8a9c;
}
.nb-stat-value {
  margin: 8px 0 6px;
  font-size: 1.7rem;
  font-weight: 700;
  color: #f5f5f7;
}
.nb-stat-delta {
  margin: 0;
  font-size: 0.78rem;
  color: #8a8a9c;
  display: flex;
  align-items: center;
  gap: 5px;
}
.nb-stat-delta.up {
  color: #00d184;
}
.nb-stat-delta.down {
  color: #ff5c7a;
}
.nb-stat-period {
  color: #5f5f70;
}
.nb-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 16px;
}
.nb-panel {
  padding: 18px;
  border-radius: 14px;
  background: #15151e;
  border: 1px solid #25252f;
}
.nb-panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
}
.nb-panel-head h2 {
  margin: 0;
  font-size: 1rem;
  color: #f5f5f7;
}
.nb-panel-hint {
  font-size: 0.74rem;
  color: #75758a;
}
.nb-link {
  background: none;
  border: none;
  color: #9aa6ff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}
.nb-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 180px;
  padding-top: 10px;
}
.nb-bar {
  flex: 1;
  min-height: 4px;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, #7e8aff, #4b54c9);
  position: relative;
  transition: height 0.4s ease;
}
.nb-bar:hover {
  background: linear-gradient(180deg, #9aa6ff, #5b64d9);
}
.nb-bar-val {
  position: absolute;
  top: -16px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.62rem;
  color: #75758a;
}
.nb-activity {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.nb-activity li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 9px;
  font-size: 0.85rem;
  color: #b6b6c6;
}
.nb-act-text strong {
  color: #e8e8ee;
}
.nb-act-when {
  font-size: 0.72rem;
  color: #5f5f70;
  white-space: nowrap;
}
.nb-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #7e8aff;
}
.nb-dot.good {
  background: #00d184;
}
.nb-dot.warn {
  background: #ffb547;
}
.nb-dot.bad {
  background: #ff5c7a;
}
.nb-dot.info {
  background: #7e8aff;
}
.nb-mini-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.86rem;
}
.nb-mini-table th {
  text-align: left;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #75758a;
  padding: 6px 8px;
  border-bottom: 1px solid #25252f;
}
.nb-mini-table td {
  padding: 9px 8px;
  border-bottom: 1px solid #1d1d27;
  color: #d4d4de;
}
.nb-pill {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: capitalize;
}
.s-active {
  background: rgba(0, 209, 132, 0.16);
  color: #00d184;
}
.s-trialing {
  background: rgba(126, 138, 255, 0.16);
  color: #9aa6ff;
}
.s-past_due {
  background: rgba(255, 181, 71, 0.16);
  color: #ffb547;
}
.s-churned {
  background: rgba(255, 92, 122, 0.16);
  color: #ff5c7a;
}
@media (max-width: 900px) {
  .nb-grid {
    grid-template-columns: 1fr;
  }
}
</style>
